'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Code,
  Database,
  Users,
  Settings,
  Play,
  Plus,
  Loader2
} from 'lucide-react';
import { ForgeCanvas } from '@/components/3d/ForgeCanvas';
import { useToast } from '@/hooks/use-toast';

export default function StudioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a project name',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName }),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([newProject, ...projects]);
        setNewProjectName('');
        toast({
          title: 'Success',
          description: 'Project created successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white"
              >
                ← Back to Projects
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{selectedProject.name}</h1>
                <p className="text-sm text-gray-400">3D AI Workspace</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Zap className="h-3 w-3 mr-1" />
                AI Ready
              </Badge>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Start Building
              </Button>
            </div>
          </div>
        </header>

        {/* Main 3D Workspace */}
        <main className="relative h-[calc(100vh-60px)]">
          <ForgeCanvas
            projectId={selectedProject.id}
            sessionId={selectedProject.id}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                FlareForge Studio
              </h1>
              <p className="text-gray-400 mt-1">Your AI-powered development workspace</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Welcome back, {session?.user?.name || session?.user?.email}
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Create New Project */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2 text-purple-400" />
              Create New Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="Enter project name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && createProject()}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={createProject} className="bg-purple-600 hover:bg-purple-700">
                  Create Project
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Card
              key={project.id}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all cursor-pointer group"
              onClick={() => setSelectedProject(project)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {project.name}
                  <Badge
                    variant={project.status === 'ready' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {project.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  {project.description || 'No description provided'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Code className="h-4 w-4 mr-1" />
                      {project.techStack?.frontend || 'React'}
                    </span>
                    <span className="flex items-center">
                      <Database className="h-4 w-4 mr-1" />
                      {project.techStack?.database || 'PostgreSQL'}
                    </span>
                  </div>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    0
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {projects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 mb-4">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No projects yet</p>
                <p className="text-sm">Create your first project to start building with AI</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}