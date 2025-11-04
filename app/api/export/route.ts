import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import JSZip from 'jszip';
import { simpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, format, config } = await request.json();

    // Validate project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Update export status
    const exportRecord = await prisma.export.create({
      data: {
        projectId,
        format,
        config: config || {},
        status: 'processing',
      },
    });

    // Start export process in background
    processExport(exportRecord.id, projectId, format, config, session.user.id)
      .catch(error => {
        console.error('Export failed:', error);
        prisma.export.update({
          where: { id: exportRecord.id },
          data: {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      });

    return NextResponse.json({ success: true, exportId: exportRecord.id });
  } catch (error) {
    console.error('Error initiating export:', error);
    return NextResponse.json(
      { error: 'Failed to initiate export' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const exportId = searchParams.get('exportId');

    if (exportId) {
      // Get specific export
      const exportRecord = await prisma.export.findFirst({
        where: { id: exportId },
        include: {
          project: {
            select: { name: true, userId: true }
          }
        },
      });

      if (!exportRecord || exportRecord.project.userId !== session.user.id) {
        return NextResponse.json({ error: 'Export not found' }, { status: 404 });
      }

      return NextResponse.json(exportRecord);
    } else if (projectId) {
      // Get all exports for a project
      const exports = await prisma.export.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          format: true,
          status: true,
          url: true,
          error: true,
          createdAt: true,
          completedAt: true,
        },
      });

      return NextResponse.json(exports);
    } else {
      // Get all user exports
      const exports = await prisma.export.findMany({
        where: {
          project: {
            userId: session.user.id
          }
        },
        include: {
          project: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(exports);
    }
  } catch (error) {
    console.error('Error fetching exports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exports' },
      { status: 500 }
    );
  }
}

async function processExport(exportId: string, projectId: string, format: string, config: any, userId: string) {
  try {
    // Get project data
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        codeStates: {
          orderBy: { version: 'desc' }
        },
        databaseStates: {
          orderBy: { version: 'desc' }
        },
        agentExecutions: {
          include: {
            agentSession: {
              include: {
                user: {
                  select: { name: true, email: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    let downloadUrl: string | null = null;

    switch (format) {
      case 'zip':
        downloadUrl = await createZipExport(project, config);
        break;
      case 'github-repo':
        downloadUrl = await createGitHubExport(project, config, userId);
        break;
      case 'docker-image':
        downloadUrl = await createDockerExport(project, config);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    // Update export record
    await prisma.export.update({
      where: { id: exportId },
      data: {
        status: 'completed',
        url: downloadUrl,
        completedAt: new Date(),
      },
    });

  } catch (error) {
    console.error('Export processing failed:', error);
    throw error;
  }
}

async function createZipExport(project: any, config: any): Promise<string> {
  const zip = new JSZip();

  // Create project structure
  const rootFolder = zip.folder(project.name);

  // Add code files
  const srcFolder = rootFolder?.folder('src');
  project.codeStates.forEach((codeState) => {
    const filePath = codeState.filePath.replace(/^\/+/, '');
    const fileContent = codeState.content || '';
    srcFolder?.file(filePath, fileContent);
  });

  // Add configuration files
  rootFolder?.file('package.json', JSON.stringify({
    name: project.name.toLowerCase().replace(/\s+/g, '-'),
    version: '0.1.0',
    description: project.description || `Generated by FlareForge AI Studio`,
    main: 'index.js',
    scripts: {
      start: 'node index.js',
      dev: 'nodemon index.js',
      test: 'jest',
    },
    dependencies: {
      express: '^4.18.0',
      cors: '^2.8.5',
      helmet: '^6.0.0',
      dotenv: '^16.0.0',
    },
    devDependencies: {
      nodemon: '^2.0.0',
      jest: '^29.0.0',
      prettier: '^2.8.0',
    },
  }, null, 2));

  rootFolder?.file('.env.example', `# Environment variables
PORT=3000
DATABASE_URL=your_database_url_here
API_KEY=your_api_key_here`);

  rootFolder?.file('README.md`, `# ${project.name}

${project.description || 'A project generated by FlareForge AI Studio'}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## Generated by
FlareForge AI Studio - Revolutionary 3D AI-powered development platform
`);

  // Add database schema
  if (project.databaseStates.length > 0) {
    const latestDbState = project.databaseStates[0];
    const dbFolder = rootFolder?.folder('database');
    dbFolder?.file('schema.sql', `-- Database Schema for ${project.name}
-- Generated by FlareForge AI Studio

${JSON.stringify(latestDbState.schema, null, 2)}
`);
  }

  // Add AI execution history
  const historyFolder = rootFolder?.folder('ai-history');
  project.agentExecutions.forEach((execution, index) => {
    const historyFile = `execution_${index + 1}_${execution.agentType}.json`;
    historyFolder?.file(historyFile, JSON.stringify({
      id: execution.id,
      model: execution.model,
      agentType: execution.agentType,
      status: execution.status,
      input: execution.input,
      output: execution.output,
      error: execution.error,
      tokensUsed: execution.tokensUsed,
      executionTime: execution.executionTime,
      createdAt: execution.createdAt,
      completedAt: execution.completedAt,
      agentSession: {
        user: execution.agentSession?.user,
        prompt: execution.agentSession?.prompt,
      }
    }, null, 2));
  });

  // Generate ZIP file
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  const fileName = `${project.name.replace(/\s+/g, '-').toLowerCase()}-export.zip`;
  const filePath = `/exports/${userId}/${projectId}/${fileName}`;

  // Ensure export directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, zipBuffer);

  return `/api/exports/download/${userId}/${projectId}/${fileName}`;
}

async function createGitHubExport(project: any, config: any, userId: string): Promise<string> {
  // This would integrate with GitHub API to create a repository
  // For now, we'll create a local export and provide instructions

  const repoName = config.repoName || `${project.name.toLowerCase().replace(/\s+/g, '-')}-forge-project`;
  const zipFile = await createZipExport(project, { ...config, repoName });

  // Create GitHub setup instructions
  const instructions = `
# GitHub Repository Setup Instructions

## Repository Created: ${repoName}

### Quick Start:

1. Create a new repository on GitHub: https://github.com/new
2. Repository name: ${repoName}
3. Choose "Public" or "Private"
4. Don't initialize with README (we've included one)
5. Click "Create repository"

### Push your code:

\`\`\`bash
# Navigate to your project directory
cd ${project.name}

# Initialize git and push
git init
git add .
git commit -m "Initial commit - Generated by FlareForge AI Studio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/${repoName}.git
git push -u origin main
\`\`\`

### Next Steps:
- [ ] Review the generated code
- [ ] Set up environment variables
- [ ] Install dependencies: \`npm install\`
- [ ] Configure database
- [ ] Run tests: \`npm test\`
- [ ] Deploy to your preferred platform

## What's Included:
✅ Complete source code
✅ Database schema and migrations
✅ AI agent execution history
✅ Configuration files
✅ README documentation
✅ Environment templates

Generated with ❤️ by FlareForge AI Studio
`;

  const instructionsPath = `/exports/${userId}/${projectId}/github-instructions.md`;
  await fs.mkdir(path.dirname(instructionsPath), { recursive: true });
  await fs.writeFile(instructionsPath, instructions);

  return `/api/exports/download/${userId}/${projectId}/github-instructions.md`;
}

async function createDockerExport(project: any, config: any): Promise<string> {
  const dockerfile = `# ${project.name} - Generated by FlareForge AI Studio
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]
`;

  const healthCheck = `const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  timeout: 2000,
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', () => {
  process.exit(1);
});

request.end();`;

  const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${config.databaseUrl || 'postgresql://user:password@localhost:5432/database'}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=${project.name.toLowerCase().replace(/\\s+/g, '-')}
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
`;

  const dockerFiles = {
    'Dockerfile': dockerfile,
    'docker-compose.yml': dockerCompose,
    'healthcheck.js': healthCheck,
    '.dockerignore': `node_modules
npm-debug.log*
.nyc_output
coverage
.nyc_output
.coverage
.cache
dist
.zip
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local`,
  };

  // Create docker export
  const zip = new JSZip();
  Object.entries(dockerFiles).forEach(([fileName, content]) => {
    zip.file(fileName, content);
  });

  // Add source code
  const srcFolder = zip.folder('src');
  project.codeStates.forEach((codeState) => {
    const filePath = codeState.filePath.replace(/^\/+/, '');
    srcFolder.file(filePath, codeState.content || '');
  });

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  const fileName = `${project.name.replace(/\s+/g, '-').toLowerCase()}-docker-export.zip`;
  const filePath = `/exports/${userId}/${projectId}/${fileName}`;

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, zipBuffer);

  return `/api/exports/download/${userId}/${projectId}/${fileName}`;
}