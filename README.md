# 🧙‍♀️ FlareForge AI Studio - Magical Witchcraft Edition

A revolutionary, immersive 3D AI-powered full-stack application builder with witchcraft theme, where magical AI agents automatically build, preview, edit, and manage applications in real-time.

## ✨ Magical Features

- **🔮 Enchanted AI Agents**: Magical AI wizards cast spells to build frontend, backend, and database simultaneously
- **💎 Mystical 3D Visualization**: Real-time 3D crystalline visualization with magical particle effects
- **📖 Ancient Grimoire Library**: Spell-crafting system for custom code generation
- **🛡️ Security Ward Casting**: Automated vulnerability detection and magical protection spells
- **🔗 One-Click Deployment**: Auto-hosting with single command deployment
- **💰 Crystal Economy**: Magical marketplace for trading enchanted artifacts
- **🔗 GitHub Integration**: Push magical creations to repositories
- **🤝 Closerouter AI Integration**: Free API credits for enhanced magical capabilities

## 🚀 One-Click Deployment

### Quick Start (Recommended)

```bash
./deploy.sh
```

This single command will:
✅ Check system requirements
✅ Install missing dependencies
✅ Set up environment configuration
✅ Start the magical server
✅ Open your browser automatically

### Manual Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables in `.env.local`

4. Set up the database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Requirements

### Prerequisites

- Node.js 18+
- PostgreSQL database (optional for basic usage)
- Redis (optional for real-time features)

### Environment Variables

Create a `.env.local` file with the following variables:

4. Set up the database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/flareforge"
REDIS_URL="redis://host:6379"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# AI Providers (User-provided via encrypted storage)
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GROK_API_KEY=""

# File Storage
SUPABASE_URL=""
SUPABASE_ANON_KEY=""

# Redis for real-time features
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# Encryption for API keys
ENCRYPTION_KEY="your-32-character-encryption-key-here"

# External Services
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── studio/            # Main 3D workspace
│   └── [project]/         # Individual project pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── 3d/               # Three.js components
│   ├── editor/           # Code editor components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utility libraries
│   ├── ai/               # AI orchestration
│   ├── auth/             # Authentication
│   ├── encryption/       # API key encryption
│   └── realtime/         # Real-time features
├── prisma/               # Database schema
├── styles/               # Global styles
└── types/                # TypeScript definitions
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber, GSAP
- **Database**: PostgreSQL, Prisma ORM
- **Real-Time**: WebSockets, Y.js, Redis
- **AI**: LangChain, OpenAI, Anthropic, Grok
- **Authentication**: NextAuth.js
- **Code Editor**: Monaco Editor

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run test` - Run tests
- `npm run test:e2e` - Run E2E tests

### Adding New Features

1. **AI Agents**: Add new agent types in `lib/ai/agentConfigs.ts`
2. **3D Components**: Create new Three.js components in `components/3d/`
3. **API Routes**: Add new endpoints in `app/api/`
4. **Database Models**: Update `prisma/schema.prisma`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Docker

```bash
docker build -t flareforge-studio .
docker run -p 3000:3000 flareforge-studio
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, join our [Discord community](https://discord.gg/flareforge) or email support@flareforge.com.

---

Built with ❤️ by the FlareForge team