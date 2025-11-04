'use client';

import { useState, useCallback } from 'react';
import {
  Zap,
  Globe,
  Database,
  Code,
  Palette,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Cpu,
  Shield,
  TrendingUp,
  Users,
  Smartphone,
  Cloud,
  Brain,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProjectConfig {
  // Basic Info
  projectName: string;
  projectDescription: string;
  projectType: string;
  targetAudience: string;

  // Technical Stack
  frontendFramework: string;
  backendLanguage: string;
  database: string;
  deployment: string;
  hosting: string;

  // Features
  features: string[];
  integrations: string[];
  advancedFeatures: string[];

  // 3D & Advanced
  enable3D: boolean;
  enableAI: boolean;
  enableRealTime: boolean;
  enableAdvanced3D: boolean;

  // Business & Monetization
  monetization: string;
  targetRevenue: string;
  businessModel: string;

  // Performance & Scale
  expectedTraffic: string;
  performanceLevel: string;
  securityLevel: string;

  // Customizations
  customRequirements: string[];
  excludedFeatures: string[];
  preferences: Record<string, any>;
}

const PROJECT_TYPES = [
  {
    id: 'saas',
    name: 'SaaS Platform',
    description: 'Software as a Service with recurring revenue',
    icon: Cloud,
    color: 'bg-blue-500',
    features: ['User Management', 'Subscription Billing', 'Analytics Dashboard', 'Multi-tenancy'],
    frameworks: ['Next.js', 'React', 'Node.js', 'TypeScript'],
    databases: ['PostgreSQL', 'MongoDB', 'Redis'],
    monetization: ['subscription', 'tiered-pricing', 'usage-based']
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Online marketplace with payment processing',
    icon: ShoppingCart,
    color: 'bg-green-500',
    features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Management'],
    frameworks: ['Next.js', 'React', 'Node.js', 'Stripe'],
    databases: ['PostgreSQL', 'Redis', 'Elasticsearch'],
    monetization: ['product-sales', 'commission', 'marketplace-fees']
  },
  {
    id: 'social',
    name: 'Social Platform',
    description: 'Community and networking platform',
    icon: Users,
    color: 'bg-purple-500',
    features: ['User Profiles', 'Social Feed', 'Messaging', 'Notifications'],
    frameworks: ['Next.js', 'React', 'Node.js', 'Socket.io'],
    databases: ['PostgreSQL', 'Redis', 'Elasticsearch'],
    monetization: ['premium-features', 'ads', 'subscription']
  },
  {
    id: 'enterprise',
    name: 'Enterprise Solution',
    description: 'Business management and productivity tools',
    icon: Building,
    color: 'bg-orange-500',
    features: ['Advanced Security', 'User Management', 'Reporting', 'Integrations'],
    frameworks: ['Next.js', 'React', 'Node.js', 'TypeScript'],
    databases: ['PostgreSQL', 'Oracle', 'SQL Server'],
    monetization: ['enterprise-license', 'per-user', 'custom-pricing']
  },
  {
    id: 'education',
    name: 'Educational Platform',
    description: 'Online learning and course management',
    icon: GraduationCap,
    color: 'bg-indigo-500',
    features: ['Course Management', 'Video Streaming', 'Student Progress', 'Certificates'],
    frameworks: ['Next.js', 'React', 'Node.js', 'WebRTC'],
    databases: ['PostgreSQL', 'MongoDB', 'Redis'],
    monetization: ['course-fees', 'subscription', 'certificates']
  },
  {
    id: 'gaming',
    name: 'Gaming Platform',
    description: 'Browser-based games with multiplayer features',
    icon: Gamepad2,
    color: 'bg-red-500',
    features: ['Game Engine', 'Multiplayer', 'Leaderboards', 'In-game Purchases'],
    frameworks: ['React', 'Three.js', 'WebGL', 'Socket.io'],
    databases: ['MongoDB', 'Redis', 'PostgreSQL'],
    monetization: ['in-app-purchases', 'game-pass', 'advertising']
  }
];

const FRONTEND_FRAMEWORKS = [
  {
    id: 'nextjs',
    name: 'Next.js 14',
    description: 'Full-stack React framework with App Router',
    icon: '⚛️',
    advantages: ['SEO-friendly', 'Server-side rendering', 'API routes', 'Performance optimized'],
    bestFor: ['E-commerce', 'Content sites', 'SaaS platforms'],
    difficulty: 'intermediate'
  },
  {
    id: 'remix',
    name: 'Remix',
    description: 'Modern web framework focused on web fundamentals',
    icon: '🎯',
    advantages: ['TypeScript first', 'Progressive enhancement', 'Great DX', 'Performance'],
    bestFor: ['Progressive web apps', 'Content sites', 'APIs'],
    difficulty: 'intermediate'
  },
  {
    id: 'vue',
    name: 'Vue 3',
    description: 'Approachable, versatile, and performant framework',
    icon: '💚',
    advantages: ['Easy to learn', 'Great performance', 'Flexible', 'Excellent docs'],
    bestFor: ['Rapid prototyping', 'Small to medium apps', 'Team collaboration'],
    difficulty: 'beginner'
  },
  {
    id: 'angular',
    name: 'Angular 17',
    description: 'Enterprise-grade framework with TypeScript',
    icon: '🅰️',
    advantages: ['TypeScript built-in', 'Enterprise features', 'Tooling', 'Long-term support'],
    bestFor: ['Enterprise apps', 'Large teams', 'Complex applications'],
    difficulty: 'advanced'
  },
  {
    id: 'svelte',
    name: 'SvelteKit',
    description: 'Cybernetically enhanced web apps',
    icon: '🔥',
    advantages: ['No runtime overhead', 'Write less code', 'Great performance', 'Reactive'],
    bestFor: ['High-performance apps', 'Small bundle size', 'Interactive sites'],
    difficulty: 'beginner'
  }
];

const DATABASE_OPTIONS = [
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Advanced open-source relational database',
    icon: '🐘',
    advantages: ['ACID compliance', 'Advanced features', 'Extensions', 'Performance'],
    bestFor: ['Complex applications', 'Data integrity', 'Analytics', 'Geospatial data'],
    scaling: 'excellent',
    complexity: 'intermediate'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'Flexible document database',
    icon: '🍃',
    advantages: ['Flexible schema', 'Scalable', 'Developer friendly', 'Rich queries'],
    bestFor: ['Rapid prototyping', 'Content management', 'Social media', 'IoT'],
    scaling: 'excellent',
    complexity: 'beginner'
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'Popular open-source relational database',
    icon: '🐬',
    advantages: ['Reliable', 'Fast', 'Widely used', 'Good tooling'],
    bestFor: ['Traditional web apps', 'E-commerce', 'Content sites', 'CRM'],
    scaling: 'good',
    complexity: 'beginner'
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Open-source Firebase alternative',
    icon: '🔮',
    advantages: ['Real-time', 'Authentication', 'Easy setup', 'PostgreSQL backend'],
    bestFor: ['Rapid development', 'Real-time apps', 'Startups', 'MVPs'],
    scaling: 'good',
    complexity: 'beginner'
  }
];

const ADVANCED_FEATURES = [
  {
    id: 'ai-features',
    name: 'AI-Powered Features',
    description: 'Machine learning, chatbots, recommendations',
    icon: Brain,
    category: 'ai',
    complexity: 'advanced',
    revenue: 'high'
  },
  {
    id: 'real-time',
    name: 'Real-time Collaboration',
    description: 'Live editing, multiplayer, instant updates',
    icon: Zap,
    category: 'realtime',
    complexity: 'intermediate',
    revenue: 'medium'
  },
  {
    id: 'advanced-3d',
    name: 'Advanced 3D Visualization',
    description: 'WebGL, Three.js, immersive experiences',
    icon: Globe,
    category: 'graphics',
    complexity: 'advanced',
    revenue: 'high'
  },
  {
    id: 'blockchain',
    name: 'Blockchain Integration',
    description: 'Smart contracts, NFTs, Web3 features',
    icon: Shield,
    category: 'blockchain',
    complexity: 'expert',
    revenue: 'high'
  },
  {
    id: 'voice',
    name: 'Voice Interface',
    description: 'Speech recognition, voice commands, audio',
    icon: Mic,
    category: 'interface',
    complexity: 'intermediate',
    revenue: 'medium'
  },
  {
    id: 'ar-vr',
    name: 'AR/VR Support',
    description: 'Augmented and virtual reality features',
    icon: Smartphone,
    category: 'immersive',
    complexity: 'expert',
    revenue: 'high'
  }
];

interface ProjectConfigWizardProps {
  onConfigComplete: (config: ProjectConfig) => void;
  className?: string;
}

export function ProjectConfigWizard({ onConfigComplete, className = '' }: ProjectConfigWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<Partial<ProjectConfig>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);

  const steps = [
    { id: 'welcome', title: 'Welcome to FlareForge', description: 'Your AI-powered development partner' },
    { id: 'vision', title: 'Project Vision', description: 'What are you building?' },
    { id: 'tech-stack', title: 'Technology Stack', description: 'Choose your tools and frameworks' },
    { id: 'features', title: 'Features & Capabilities', description: 'Define what your app will do' },
    { id: 'business', title: 'Business & Monetization', description: 'How will this make money?' },
    { id: 'review', title: 'AI Analysis', description: 'Let AI optimize your choices' },
    { id: 'confirmation', title: 'Confirm & Generate', description: 'Review and generate your project' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnalyzeWithAI = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    setAiRecommendations({
      suggestedFramework: 'Next.js',
      suggestedDatabase: 'PostgreSQL',
      suggestedFeatures: ['Authentication', 'Analytics', 'Real-time'],
      performance: 95,
      scalability: 88,
      revenue: 92
    });
    setIsAnalyzing(false);
  };

  const handleConfigComplete = () => {
    if (config.projectName && config.frontendFramework && config.database) {
      onConfigComplete(config as ProjectConfig);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return <VisionStep config={config} setConfig={setConfig} onNext={handleNext} />;
      case 2:
        return <TechStackStep config={config} setConfig={setConfig} onNext={handleNext} />;
      case 3:
        return <FeaturesStep config={config} setConfig={setConfig} onNext={handleNext} />;
      case 4:
        return <BusinessStep config={config} setConfig={setConfig} onNext={handleNext} />;
      case 5:
        return <AIAnalysisStep
          config={config}
          setConfig={setConfig}
          onAnalyze={handleAnalyzeWithAI}
          recommendations={aiRecommendations}
          isAnalyzing={isAnalyzing}
          onNext={handleNext}
        />;
      case 6:
        return <ConfirmationStep
          config={config}
          recommendations={aiRecommendations}
          onComplete={handleConfigComplete}
        />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 ${className}`}>
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FlareForge AI Studio</h1>
                <p className="text-sm text-gray-300"> billion-dollar web development platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                <Rocket className="h-3 w-3 mr-1" />
                Production-Ready
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-black/10 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">{steps[currentStep].title}</h2>
            <span className="text-sm text-gray-300">Step {currentStep + 1} of {steps.length}</span>
          </div>
          <div className="flex gap-1">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-black/20 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardDescription className="text-gray-300">
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="border-gray-600 text-gray-300 hover:border-gray-500"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(6)}
                  className="border-gray-600 text-gray-300 hover:border-gray-500"
                >
                  Skip to Review
                </Button>
              )}
            </div>

            {currentStep < steps.length - 1 && (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {currentStep === 5 && !aiRecommendations ? 'Analyze with AI' : 'Next'}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Welcome to FlareForge AI Studio
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Build billion-dollar websites with AI-powered 3D web generation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <Brain className="h-8 w-8 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
          <p className="text-gray-400 text-sm">
            Advanced AI analyzes your requirements and suggests optimal solutions
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <Globe className="h-8 w-8 text-blue-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">3D Web Generation</h3>
          <p className="text-gray-400 text-sm">
            Create immersive 3D websites with advanced WebGL and animations
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <Rocket className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Production-Ready</h3>
          <p className="text-gray-400 text-sm">
            Enterprise-grade code that's scalable, secure, and optimized
          </p>
        </div>
      </div>

      <Button
        onClick={onNext}
        size="lg"
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
      >
        Start Building Your Billion-Dollar App
        <Rocket className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );
}

function VisionStep({ config, setConfig, onNext }: {
  config: Partial<ProjectConfig>;
  setConfig: (config: Partial<ProjectConfig>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Project Name
        </label>
        <input
          type="text"
          value={config.projectName || ''}
          onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
          placeholder="My Billion Dollar App"
          className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Project Description
        </label>
        <textarea
          value={config.projectDescription || ''}
          onChange={(e) => setConfig({ ...config, projectDescription: e.target.value })}
          placeholder="Describe your billion-dollar idea..."
          rows={3}
          className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          What type of project are you building?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECT_TYPES.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all duration-200 ${
                config.projectType === type.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-white/5'
              }`}
              onClick={() => setConfig({ ...config, projectType: type.id })}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center`}>
                    <type.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{type.name}</h3>
                    <p className="text-xs text-gray-400">{type.description}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {type.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Target Audience
        </label>
        <input
          type="text"
          value={config.targetAudience || ''}
          onChange={(e) => setConfig({ ...config, targetAudience: e.target.value })}
          placeholder="e.g., Enterprise customers, Developers, Consumers"
          className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
      </div>
    </div>
  );
}

function TechStackStep({ config, setConfig, onNext }: {
  config: Partial<ProjectConfig>;
  setConfig: (config: Partial<ProjectConfig>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Frontend Framework
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FRONTEND_FRAMEWORKS.map((framework) => (
            <Card
              key={framework.id}
              className={`cursor-pointer transition-all duration-200 ${
                config.frontendFramework === framework.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-white/5'
              }`}
              onClick={() => setConfig({ ...config, frontendFramework: framework.id })}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{framework.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{framework.name}</h3>
                    <p className="text-xs text-gray-400">{framework.description}</p>
                  </div>
                  <Badge variant={framework.difficulty === 'beginner' ? 'secondary' :
                                 framework.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                    {framework.difficulty}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-300 font-medium">Best for:</p>
                  <div className="flex flex-wrap gap-1">
                    {framework.bestFor.slice(0, 2).map((item, index) => (
                      <span key={index} className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Database
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DATABASE_OPTIONS.map((db) => (
            <Card
              key={db.id}
              className={`cursor-pointer transition-all duration-200 ${
                config.database === db.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-white/5'
              }`}
              onClick={() => setConfig({ ...config, database: db.id })}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{db.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{db.name}</h3>
                    <p className="text-xs text-gray-400">{db.description}</p>
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {db.scaling}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-300">Advantages:</p>
                  <div className="flex flex-wrap gap-1">
                    {db.advantages.slice(0, 2).map((adv, index) => (
                      <span key={index} className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {adv}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Backend Language (Optional)
        </label>
        <select
          value={config.backendLanguage || ''}
          onChange={(e) => setConfig({ ...config, backendLanguage: e.target.value })}
          className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">Auto-select based on framework</option>
          <option value="nodejs">Node.js (JavaScript/TypeScript)</option>
          <option value="python">Python</option>
          <option value="rust">Rust</option>
          <option value="go">Go</option>
          <option value="java">Java</option>
        </select>
      </div>
    </div>
  );
}

function FeaturesStep({ config, setConfig, onNext }: {
  config: Partial<ProjectConfig>;
  setConfig: (config: Partial<ProjectConfig>) => void;
  onNext: () => void;
}) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(config.features || []);

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
    setConfig({ ...config, features: selectedFeatures });
  };

  const commonFeatures = [
    { id: 'auth', name: 'User Authentication', icon: Shield, description: 'Secure login and registration' },
    { id: 'dashboard', name: 'Admin Dashboard', icon: LayoutDashboard, description: 'Control panel for administrators' },
    { id: 'payments', name: 'Payment Processing', icon: CreditCard, description: 'Accept payments and subscriptions' },
    { id: 'notifications', name: 'Push Notifications', icon: Bell, description: 'Real-time user notifications' },
    { id: 'analytics', name: 'Analytics Dashboard', icon: BarChart, description: 'Track usage and metrics' },
    { id: 'api', name: 'REST API', icon: Zap, description: 'Programmatic access to data' },
    { id: 'mobile', name: 'Mobile Responsive', icon: Smartphone, description: 'Works on all devices' },
    { id: 'search', name: 'Advanced Search', icon: Search, description: 'Powerful search functionality' },
    { id: 'cms', name: 'Content Management', icon: FileText, description: 'Manage content easily' },
    { id: 'multilingual', name: 'Multi-language', icon: Globe, description: 'Support multiple languages' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-4 w-4 text-blue-400" />
          <p className="text-sm text-gray-300">
            Select the features you want to include in your project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {commonFeatures.map((feature) => (
            <Card
              key={feature.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedFeatures.includes(feature.id)
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-white/5'
              }`}
              onClick={() => toggleFeature(feature.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className="h-5 w-5 text-purple-400" />
                  <h3 className="font-semibold text-white">{feature.name}</h3>
                </div>
                <p className="text-xs text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Advanced Features (AI-Enhanced)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ADVANCED_FEATURES.map((feature) => (
            <Card
              key={feature.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedFeatures.includes(feature.id)
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-white/5'
              }`}
              onClick={() => toggleFeature(feature.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className="h-5 w-5 text-purple-400" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{feature.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={feature.complexity === 'beginner' ? 'text-green-400 border-green-400' :
                                                       feature.complexity === 'intermediate' ? 'text-yellow-400 border-yellow-400' :
                                                       'text-red-400 border-red-400'}>
                        {feature.complexity}
                      </Badge>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {feature.revenue}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function BusinessStep({ config, setConfig, onNext }: {
  config: Partial<ProjectConfig>;
  setConfig: (config: Partial<ProjectConfig>) => void;
  onNext: () => void;
}) {
  const monetizationOptions = [
    { id: 'subscription', name: 'Subscription Model', description: 'Recurring revenue with tiers' },
    { id: 'one-time', name: 'One-time Purchase', description: 'Sell products or services' },
    { id: 'freemium', name: 'Freemium', description: 'Free basic features, paid premium' },
    { id: 'marketplace', name: 'Marketplace', description: 'Take commission on transactions' },
    { id: 'advertising', name: 'Advertising', description: 'Display ads to users' },
    { id: 'enterprise', name: 'Enterprise Sales', description: 'B2B licensing and contracts' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          How do you plan to make money?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monetizationOptions.map((option) => (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all duration-200 ${
                config.monetization === option.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-white/5'
              }`}
              onClick={() => setConfig({ ...config, monetization: option.id })}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-2">{option.name}</h3>
                <p className="text-sm text-gray-400">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Target Monthly Revenue
        </label>
        <select
          value={config.targetRevenue || ''}
          onChange={(e) => setConfig({ ...config, targetRevenue: e.target.value })}
          className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">Select target revenue</option>
          <option value="1000-10000">$1,000 - $10,000</option>
          <option value="10000-50000">$10,000 - $50,000</option>
          <option value="50000-100000">$50,000 - $100,000</option>
          <option value="100000-1000000">$100,000 - $1M</option>
          <option value="1000000+">$1M+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Expected Traffic
        </label>
        <select
          value={config.expectedTraffic || ''}
          onChange={(e) => setConfig({ ...config, expectedTraffic: e.target.value })}
          className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">Select expected traffic</option>
          <option value="1k-10k">1,000 - 10,000 users/month</option>
          <option value="10k-100k">10,000 - 100,000 users/month</option>
          <option value="100k-1m">100,000 - 1M users/month</option>
          <option value="1m-10m">1M - 10M users/month</option>
          <option value="10m+">10M+ users/month</option>
        </select>
      </div>
    </div>
  );
}

function AIAnalysisStep({
  config,
  setConfig,
  onAnalyze,
  recommendations,
  isAnalyzing,
  onNext
}: {
  config: Partial<ProjectConfig>;
  setConfig: (config: Partial<ProjectConfig>) => void;
  onAnalyze: () => void;
  recommendations: any;
  isAnalyzing: boolean;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Analysis</h3>
        <p className="text-gray-300 mb-6">
          Let our advanced AI analyze your requirements and optimize your project configuration
        </p>

        {!recommendations && !isAnalyzing && (
          <Button
            onClick={onAnalyze}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
          >
            <Brain className="h-5 w-5 mr-2" />
            Analyze with AI
          </Button>
        )}

        {isAnalyzing && (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-300">Analyzing your project requirements...</p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        )}

        {recommendations && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {recommendations.performance}%
                  </div>
                  <p className="text-sm text-gray-300">Performance Score</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {recommendations.scalability}%
                  </div>
                  <p className="text-sm text-gray-300">Scalability Score</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {recommendations.revenue}%
                  </div>
                  <p className="text-sm text-gray-300">Revenue Potential</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">AI Recommendations</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">
                    <strong>{recommendations.suggestedFramework}</strong> is optimal for your project type
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">
                    <strong>{recommendations.suggestedDatabase}</strong> provides the best performance and scalability
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-300">
                    Consider adding <strong>{recommendations.suggestedFeatures.join(', ')}</strong> for better monetization
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfirmationStep({
  config,
  recommendations,
  onComplete
}: {
  config: Partial<ProjectConfig>;
  recommendations: any;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-4">Ready to Generate!</h3>
        <p className="text-gray-300 mb-6">
          Review your project configuration and click generate to start building your billion-dollar app
        </p>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Project Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-400 mb-2">Project Details</h5>
              <div className="space-y-1">
                <p className="text-white"><strong>Name:</strong> {config.projectName}</p>
                <p className="text-white"><strong>Type:</strong> {config.projectType}</p>
                <p className="text-white"><strong>Framework:</strong> {config.frontendFramework}</p>
                <p className="text-white"><strong>Database:</strong> {config.database}</p>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-400 mb-2">Business Model</h5>
              <div className="space-y-1">
                <p className="text-white"><strong>Monetization:</strong> {config.monetization}</p>
                <p className="text-white"><strong>Target Revenue:</strong> {config.targetRevenue}</p>
                <p className="text-white"><strong>Traffic:</strong> {config.expectedTraffic}</p>
              </div>
            </div>
          </div>

          {config.features && config.features.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-400 mb-2">Selected Features</h5>
              <div className="flex flex-wrap gap-2">
                {config.features.slice(0, 5).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-purple-400 border-purple-400">
                    {feature}
                  </Badge>
                ))}
                {config.features.length > 5 && (
                  <Badge variant="outline" className="text-gray-400 border-gray-400">
                    +{config.features.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={onComplete}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-12"
        >
          <Rocket className="h-5 w-5 mr-2" />
          Generate My Billion-Dollar App
        </Button>
      </div>
    </div>
  );
}

function isStepValid(): boolean {
  // Add validation logic based on current step
  return true; // Simplified for now
}

// Add missing imports
import {
  ShoppingCart,
  Building,
  GraduationCap,
  Gamepad2,
  LayoutDashboard,
  CreditCard,
  Bell,
  BarChart,
  Search,
  FileText
} from 'lucide-react';