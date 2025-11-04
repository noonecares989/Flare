'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Sparkles,
  Globe,
  Database,
  Code,
  Users,
  Rocket,
  Eye,
  Settings,
  Download,
  Play,
  Pause,
  Save,
  Monitor,
  Shield,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
  Layers,
  Smartphone,
  DollarSign
} from 'lucide-react';
import { ForgeCanvas } from '@/components/3d/ForgeCanvas';
import { Web3DGenerator } from '@/components/3d/WebGenerator3D';
import { ProjectConfigWizard } from '@/components/wizard/ProjectConfigWizard';
import { AIChatInterface } from '@/components/agents/AIChatInterface';
import { DatabaseManager } from '@/components/db/DatabaseManager';
import { EditorWorkspace } from '@/components/editor/EditorWorkspace';
import { ExportManager } from '@/components/dashboard/ExportManager';
import { multiFrameworkCodeGenerator } from '@/lib/code/CodeGenerator';
import { techStackRecommender } from '@/lib/ai/techStackRecommender';

interface ProjectData {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'building' | 'testing' | 'ready' | 'deployed';
  techStack: {
    frontend: string;
    backend: string;
    database: string;
    deployment: string;
  };
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface StudioState {
  activeTab: 'wizard' | '3d' | 'editor' | 'database' | 'ai-chat' | 'analytics' | 'export';
  projectData: ProjectData | null;
  isGenerating: boolean;
  generationProgress: number;
  lastActivity: Date;
}

export default function StudioPage() {
  const params = useParams();
  const projectId = params.projectId;

  const [studioState, setStudioState] = useState<StudioState>({
    activeTab: 'wizard',
    projectData: null,
    isGenerating: false,
    generationProgress: 0,
    lastActivity: new Date(),
  });

  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Load project data
  useEffect(() => {
    if (projectId) {
      // Simulate loading project data
      const mockProject: ProjectData = {
        id: projectId,
        name: 'My Billion Dollar App',
        description: 'An AI-powered SaaS platform with real-time collaboration and advanced analytics',
        status: 'building',
        techStack: {
          frontend: 'Next.js 14',
          backend: 'Node.js',
          database: 'PostgreSQL',
          deployment: 'Vercel'
        },
        features: [
          'user-authentication',
          'real-time-collaboration',
          'ai-analytics',
          'advanced-3d',
          'payment-system'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setStudioState(prev => ({ ...prev, projectData: mockProject }));
    }
  }, [projectId]);

  const handleProjectConfigComplete = async (config: any) => {
    setStudioState(prev => ({ ...prev, activeTab: '3d', isGenerating: true }));

    // Generate AI recommendation
    const recommendation = await techStackRecommender.recommendTechStack({
      projectName: config.projectName,
      projectType: config.projectType,
      projectDescription: config.projectDescription,
      targetAudience: config.targetAudience,
      targetRevenue: config.targetRevenue,
      expectedTraffic: config.expectedTraffic,
      monetization: config.monetization,
      features: config.features,
      customRequirements: config.customRequirements
    });

    setAiRecommendation(recommendation);

    // Generate code
    setTimeout(() => {
      setStudioState(prev => ({
        ...prev,
        activeTab: 'editor',
        isGenerating: false,
        generationProgress: 100
      }));
    }, 3000);
  };

  const handleFeaturesSelected = async (features: string[]) => {
    setSelectedFeatures(features);
    setStudioState(prev => ({ ...prev, activeTab: 'editor' }));
  };

  const startGeneration = async () => {
    setStudioState(prev => ({ ...prev, isGenerating: true, generationProgress: 0 }));

    // Simulate generation progress
    const progressInterval = setInterval(() => {
      setStudioState(prev => {
        const newProgress = Math.min(prev.generationProgress + 10, 100);
        return { ...prev, generationProgress: newProgress };
      });
    }, 500);

    setTimeout(() => {
      clearInterval(progressInterval);
      setStudioState(prev => ({
        ...prev,
        isGenerating: false,
        activeTab: 'database',
        generationProgress: 100
      }));
    }, 10000);
  };

  const handleExport = async () => {
    setStudioState(prev => ({ ...prev, activeTab: 'export' }));
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'wizard': return <Brain className="h-5 w-5" />;
      case '3d': return <Globe className="h-5 w-5" />;
      case 'editor': return <Code className="h-5 w-5" />;
      case 'database': return <Database className="h-5 w-5" />;
      case 'ai-chat': return <Users className="h-5 w-5" />;
      case 'analytics': return <Monitor className="h-5 w-5" />;
      case 'export': return <Download className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const getTabName = (tab: string) => {
    switch (tab) {
      case 'wizard': return 'AI Config';
      case '3d': return '3D Preview';
      case 'editor': return 'Code Editor';
      case 'database': return 'Database';
      case 'ai-chat': return 'AI Chat';
      case 'analytics': return 'Analytics';
      case 'export': return 'Export';
      default: return 'Settings';
    }
  };

  const getTabColor = (tab: string) => {
    switch (tab) {
      case 'wizard': return 'text-purple-400 border-purple-400';
      case '3d': return 'text-blue-400 border-blue-400';
      case 'editor': return 'text-green-400 border-green-400';
      case 'database': return 'text-orange-400 border-orange-400';
      case 'ai-chat': return 'text-pink-400 border-pink-400';
      case 'analytics': return 'text-yellow-400 border-yellow-400';
      case 'export': return 'text-cyan-400 border-cyan-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-400 bg-gray-800';
      case 'building': return 'text-blue-400 bg-blue-800';
      case 'testing': return 'text-yellow-400 bg-yellow-800';
      case 'ready': return 'text-green-400 bg-green-800';
      case 'deployed': return 'text-purple-400 bg-purple-800';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  FlareForge AI Studio
                </h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                  <Badge variant="outline" className="text-purple-400 border-purple-400">
                    <Brain className="h-3 w-3 mr-1" />
                    AI-Powered
                  </Badge>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Billion-Dollar Ready
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-300">
                {studioState.projectData && (
                  <>
                    <span>Project: {studioState.projectData.name}</span>
                    <span>•</span>
                    <span>Status: <span className={`font-medium ${getStatusColor(studioState.projectData.status)}`}>
                      {studioState.projectData.status.charAt(0).toUpperCase() + studioState.projectData.status.slice(1)}
                    </span></span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="border-gray-600 text-gray-300 hover:border-gray-500"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="border-gray-600 text-gray-300 hover:border-gray-500"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Monitor
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4">
            <Tabs value={studioState.activeTab} onValueChange={(value) => setStudioState(prev => ({ ...prev, activeTab: value }))}>
              <TabsList className="w-full justify-start">
                {[
                  'wizard', '3d', 'editor', 'database', 'ai-chat', 'analytics', 'export'
                ].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${getTabColor(tab)} border-b-2 ${studioState.activeTab === tab ? '' : 'border-transparent'}`}
                  >
                    {getTabIcon(tab)}
                    <span>{getTabName(tab)}</span>
                    {tab === 'wizard' && aiRecommendation && (
                      <Badge variant="outline" className="ml-2 text-green-400 border-green-400">
                        {aiRecommendation.confidence}% Match
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6">
          <TabsContent>
            <TabsContent value="wizard">
              <ProjectConfigWizard
                onConfigComplete={handleProjectConfigComplete}
              />
            </TabsContent>

            <TabsContent value="3d">
              {studioState.projectData && (
                <Web3DGenerator
                  config={studioState.projectData}
                  onPreview={(preview) => console.log('Preview:', preview)}
                  onSave={(config) => console.log('Save:', config)}
                />
              )}
            </TabsContent>

            <TabsContent value="editor">
              {studioState.projectData && (
                <EditorWorkspace
                  sessionId={studioState.projectData.id}
                  projectId={studioState.projectData.id}
                  initialFiles={[]}
                />
              )}
            </TabsContent>

            <TabsContent value="database">
              {studioState.projectData && (
                <DatabaseManager
                  projectId={studioState.projectData.id}
                  projectName={studioState.projectData.name}
                />
              )}
            </TabsContent>

            <TabsContent value="ai-chat">
              {studioState.projectData && (
                <AIChatInterface
                  sessionId={studioState.projectData.id}
                  projectId={studioState.projectData.id}
                  initialMessage={`Hi! I'm your AI assistant for ${studioState.projectData.name}. How can I help you build your billion-dollar app?`}
                />
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="bg-white/10 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-purple-400" />
                    Analytics Dashboard
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Real-time insights and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-white/5 border border-gray-700 p-4 text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">92%</div>
                      <p className="text-sm text-gray-300">Performance Score</p>
                    </Card>
                    <Card className="bg-white/5 border border-gray-700 p-4 text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">1.2M</div>
                      <p className="text-sm text-gray-300">Monthly Users</p>
                    </Card>
                    <Card className="bg-white/5 border border-gray-700 p-4 text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">$250K</div>
                      <p className="text-sm text-gray-300">MRR</p>
                    </Card>
                    <Card className="bg-white/5 border border-gray-700 p-4 text-center">
                      <div className="text-3xl font-bold text-orange-400 mb-2">99.9%</div>
                      <p className="text-sm text-gray-300">Uptime</p>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export">
              {studioState.projectData && (
                <ExportManager
                  projectId={studioState.projectData.id}
                  projectName={studioState.projectData.name}
                />
              )}
            </TabsContent>
          </TabsContent>
        </div>

        {/* Progress Indicator */}
        {studioState.isGenerating && (
          <div className="fixed bottom-4 right-4 z-50">
            <Card className="bg-black/80 backdrop-blur-md border border-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <h4 className="text-white font-semibold">Generating Your App</h4>
                    <p className="text-sm text-gray-300">
                      {studioState.generationProgress}% Complete
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Floating Status */}
        {!studioState.isGenerating && studioState.projectData && (
          <div className="fixed top-4 right-4 z-40">
            <Card className="bg-black/80 backdrop-blur-md border border-white/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-pulse"></div>
                  <div className="text-sm text-white">
                    <p className="font-medium">Building...</p>
                    <p className="text-xs text-gray-400">
                      {studioState.projectData.name} • {studioState.projectData.techStack.frontend}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}