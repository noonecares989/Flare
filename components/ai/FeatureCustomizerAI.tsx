'use client';

import { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Shield,
  Zap,
  Globe,
  Smartphone,
  Clock,
  ChevronRight,
  Info,
  Plus,
  X,
  Star,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'advanced' | 'premium' | 'enterprise';
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  developmentTime: number; // in days
  cost: 'low' | 'medium' | 'high' | 'enterprise';
  impact: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[];
  alternatives: string[];
  tags: string[];
  icon: string;
  color: string;
  roi: number; // Return on Investment score 1-100
  userValue: number; // User value score 1-100
  technicalDebt: number; // Technical debt score 1-100
}

interface AIRecommendation {
  features: Feature[];
  reasoning: string;
  confidence: number; // 1-100
  estimatedRevenue: string;
  developmentCost: string;
  timeline: string;
  risks: string[];
  opportunities: string[];
}

interface FeatureCustomizerAIProps {
  projectConfig: any;
  onFeaturesSelected: (features: Feature[]) => void;
  className?: string;
}

const FEATURE_DATABASE: Feature[] = [
  // Core Features
  {
    id: 'user-authentication',
    name: 'Advanced User Authentication',
    description: 'Multi-provider authentication with social login, SSO, and enterprise SAML',
    category: 'core',
    complexity: 'intermediate',
    developmentTime: 5,
    cost: 'medium',
    impact: 'critical',
    dependencies: [],
    alternatives: ['basic-auth'],
    tags: ['security', 'users', 'auth'],
    icon: '🔐',
    color: 'bg-blue-500',
    roi: 85,
    userValue: 90,
    technicalDebt: 20
  },
  {
    id: 'responsive-design',
    name: 'Responsive Design System',
    description: 'Mobile-first design with adaptive layouts and touch interactions',
    category: 'core',
    complexity: 'beginner',
    developmentTime: 3,
    cost: 'low',
    impact: 'high',
    dependencies: [],
    alternatives: [],
    tags: ['mobile', 'ui', 'responsive'],
    icon: '📱',
    color: 'bg-green-500',
    roi: 90,
    userValue: 95,
    technicalDebt: 10
  },
  {
    id: 'admin-dashboard',
    name: 'Admin Dashboard',
    description: 'Comprehensive admin panel with analytics, user management, and system controls',
    category: 'core',
    complexity: 'intermediate',
    developmentTime: 7,
    cost: 'medium',
    impact: 'high',
    dependencies: ['user-authentication'],
    alternatives: ['basic-admin'],
    tags: ['admin', 'dashboard', 'analytics'],
    icon: '📊',
    color: 'bg-purple-500',
    roi: 75,
    userValue: 80,
    technicalDebt: 25
  },

  // Advanced Features
  {
    id: 'real-time-collaboration',
    name: 'Real-time Collaboration',
    description: 'Live editing, cursors, and multi-user presence with WebSocket technology',
    category: 'advanced',
    complexity: 'advanced',
    developmentTime: 12,
    cost: 'high',
    impact: 'critical',
    dependencies: ['websocket-infrastructure'],
    alternatives: ['basic-editing'],
    tags: ['realtime', 'collaboration', 'websocket'],
    icon: '🤝',
    color: 'bg-indigo-500',
    roi: 95,
    userValue: 85,
    technicalDebt: 40
  },
  {
    id: 'ai-analytics',
    name: 'AI-Powered Analytics',
    description: 'Machine learning insights, predictive analytics, and intelligent recommendations',
    category: 'advanced',
    complexity: 'expert',
    developmentTime: 20,
    cost: 'enterprise',
    impact: 'critical',
    dependencies: ['data-pipeline', 'ml-infrastructure'],
    alternatives: ['basic-analytics'],
    tags: ['ai', 'analytics', 'ml', 'insights'],
    icon: '🧠',
    color: 'bg-pink-500',
    roi: 90,
    userValue: 95,
    technicalDebt: 60
  },
  {
    id: 'advanced-3d',
    name: 'Advanced 3D Visualization',
    description: 'WebGL-based 3D models, animations, and immersive experiences',
    category: 'advanced',
    complexity: 'expert',
    developmentTime: 15,
    cost: 'high',
    impact: 'high',
    dependencies: ['webgl-infrastructure'],
    alternatives: ['basic-3d'],
    tags: ['3d', 'webgl', 'visualization', 'immersive'],
    icon: '🌐',
    color: 'bg-cyan-500',
    roi: 85,
    userValue: 80,
    technicalDebt: 50
  },

  // Premium Features
  {
    id: 'payment-system',
    name: 'Enterprise Payment System',
    description: 'Multi-currency payments, subscriptions, invoicing, and tax compliance',
    category: 'premium',
    complexity: 'advanced',
    developmentTime: 18,
    cost: 'high',
    impact: 'critical',
    dependencies: ['user-authentication', 'admin-dashboard'],
    alternatives: ['basic-payments'],
    tags: ['payments', 'subscriptions', 'revenue'],
    icon: '💳',
    color: 'bg-yellow-500',
    roi: 95,
    userValue: 90,
    technicalDebt: 45
  },
  {
    id: 'multi-tenancy',
    name: 'Multi-Tenant Architecture',
    description: 'Isolated tenants, custom domains, and per-tenant customizations',
    category: 'premium',
    complexity: 'expert',
    developmentTime: 25,
    cost: 'enterprise',
    impact: 'critical',
    dependencies: ['user-authentication', 'advanced-security'],
    alternatives: ['single-tenant'],
    tags: ['saas', 'multi-tenant', 'enterprise'],
    icon: '🏢',
    color: 'bg-orange-500',
    roi: 90,
    userValue: 85,
    technicalDebt: 55
  },

  // Enterprise Features
  {
    id: 'blockchain-integration',
    name: 'Blockchain Integration',
    description: 'Smart contracts, NFTs, crypto payments, and Web3 connectivity',
    category: 'enterprise',
    complexity: 'expert',
    developmentTime: 30,
    cost: 'enterprise',
    impact: 'high',
    dependencies: ['advanced-security'],
    alternatives: ['traditional-payments'],
    tags: ['blockchain', 'web3', 'crypto', 'nft'],
    icon: '⛓',
    color: 'bg-purple-600',
    roi: 75,
    userValue: 70,
    technicalDebt: 70
  },
  {
    id: 'voice-interface',
    name: 'Voice Interface & Commands',
    description: 'Speech recognition, voice commands, and natural language processing',
    category: 'enterprise',
    complexity: 'expert',
    developmentTime: 22,
    cost: 'enterprise',
    impact: 'medium',
    dependencies: ['ai-infrastructure'],
    alternatives: ['traditional-ui'],
    tags: ['voice', 'speech', 'nlp', 'accessibility'],
    icon: '🎤',
    color: 'bg-red-500',
    roi: 70,
    userValue: 75,
    technicalDebt: 65
  }
];

export function FeatureCustomizerAI({ projectConfig, onFeaturesSelected, className = '' }: FeatureCustomizerAIProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customRequirements, setCustomRequirements] = useState('');
  const [excludedFeatures, setExcludedFeatures] = useState<string[]>([]);
  const [budgetConstraint, setBudgetConstraint] = useState('');
  const [timelineConstraint, setTimelineConstraint] = useState('');

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Analyze project requirements and recommend features
    const recommendation = await generateAIRecommendation(
      projectConfig,
      selectedFeatures,
      customRequirements,
      budgetConstraint,
      timelineConstraint,
      excludedFeatures
    );

    setAiRecommendation(recommendation);
    setIsAnalyzing(false);
  };

  const generateAIRecommendation = async (
    config: any,
    currentFeatures: Feature[],
    requirements: string,
    budget: string,
    timeline: string,
    excluded: string[]
  ): Promise<AIRecommendation> => {
    // AI-powered feature selection logic
    const availableFeatures = FEATURE_DATABASE.filter(f => !excluded.includes(f.id));

    // Analyze project type and requirements
    const projectType = config.projectType || 'general';
    const projectScale = config.expectedTraffic || 'small';
    const monetization = config.monetization || 'none';

    let recommendedFeatures: Feature[] = [];
    let reasoning = '';
    let confidence = 0;

    // Core features analysis
    if (projectType === 'saas' || projectType === 'enterprise') {
      recommendedFeatures.push(
        ...availableFeatures.filter(f =>
          f.category === 'core' &&
          (f.impact === 'critical' || f.impact === 'high')
        )
      );
      reasoning += 'Core features prioritized for SaaS/Enterprise model. ';
    }

    // Advanced features based on requirements
    if (requirements.toLowerCase().includes('real-time') ||
        requirements.toLowerCase().includes('collaboration')) {
      recommendedFeatures.push(
        ...availableFeatures.filter(f => f.id === 'real-time-collaboration')
      );
      reasoning += 'Real-time collaboration features added based on requirements. ';
    }

    if (requirements.toLowerCase().includes('ai') ||
        requirements.toLowerCase().includes('analytics') ||
        projectType === 'saas') {
      recommendedFeatures.push(
        ...availableFeatures.filter(f => f.id === 'ai-analytics')
      );
      reasoning += 'AI Analytics recommended for data-driven insights. ';
    }

    if (requirements.toLowerCase().includes('3d') ||
        requirements.toLowerCase().includes('immersive')) {
      recommendedFeatures.push(
        ...availableFeatures.filter(f => f.id === 'advanced-3d')
      );
      reasoning += 'Advanced 3D visualization added for immersive experience. ';
    }

    // Budget constraints
    if (budget.includes('low') || budget.includes('1000-10000')) {
      recommendedFeatures = recommendedFeatures.filter(f => f.cost === 'low');
      reasoning += 'Budget-constrained selection focusing on high-ROI features. ';
    } else if (budget.includes('enterprise') || budget.includes('200000+')) {
      recommendedFeatures.push(
        ...availableFeatures.filter(f => f.category === 'enterprise')
      );
      reasoning += 'Enterprise-level features included for premium positioning. ';
    }

    // Timeline constraints
    if (timeline.includes('2-4') || timeline.includes('4-8')) {
      recommendedFeatures = recommendedFeatures.filter(f => f.developmentTime <= 10);
      reasoning += 'Timeline-optimized selection for rapid development. ';
    }

    // Monetization-based features
    if (monetization === 'subscription' || monetization === 'marketplace') {
      recommendedFeatures.push(
        ...availableFeatures.filter(f => f.id === 'payment-system')
      );
      reasoning += 'Payment system essential for monetization strategy. ';
    }

    // Calculate confidence
    const requirementsMet = recommendedFeatures.length;
    const totalRequirements = requirements.split(' ').length;
    confidence = Math.min(95, Math.round((requirementsMet / Math.max(totalRequirements, 1)) * 100));

    // Calculate estimates
    const totalDevTime = recommendedFeatures.reduce((sum, f) => sum + f.developmentTime, 0);
    const totalROI = recommendedFeatures.reduce((sum, f) => sum + f.roi, 0) / Math.max(recommendedFeatures.length, 1);
    const totalRevenue = estimateRevenue(recommendedFeatures, projectType, monetization);
    const totalCost = estimateCost(recommendedFeatures);

    return {
      features: recommendedFeatures,
      reasoning: reasoning || 'AI-selected features based on project requirements',
      confidence,
      estimatedRevenue: totalRevenue,
      developmentCost: totalCost,
      timeline: `${totalDevTime} weeks`,
      risks: identifyRisks(recommendedFeatures),
      opportunities: identifyOpportunities(recommendedFeatures, projectType)
    };
  };

  const estimateRevenue = (features: Feature[], projectType: string, monetization: string): string => {
    const baseRevenue = features.reduce((sum, f) => sum + f.roi, 0) / Math.max(features.length, 1);
    const multiplier = projectType === 'saas' ? 2 : projectType === 'ecommerce' ? 1.5 : 1;
    const monthlyRevenue = Math.round(baseRevenue * multiplier * 1000);

    if (monthlyRevenue < 5000) return '$1,000-$5,000/month';
    if (monthlyRevenue < 20000) return '$5,000-$20,000/month';
    if (monthlyRevenue < 100000) return '$20,000-$100,000/month';
    return '$100,000+/month';
  };

  const estimateCost = (features: Feature[]): string => {
    const totalCost = features.reduce((sum, f) => {
      switch (f.cost) {
        case 'low': return sum + 5000;
        case 'medium': return sum + 15000;
        case 'high': return sum + 50000;
        case 'enterprise': return sum + 150000;
        default: return sum;
      }
    }, 0);

    if (totalCost < 25000) return '$10,000-$25,000';
    if (totalCost < 100000) return '$25,000-$100,000';
    if (totalCost < 250000) return '$100,000-$250,000';
    return '$250,000+';
  };

  const identifyRisks = (features: Feature[]): string[] => {
    const risks: string[] = [];

    if (features.some(f => f.complexity === 'expert')) {
      risks.push('High complexity may lead to longer development timeline');
    }

    if (features.some(f => f.technicalDebt > 50)) {
      risks.push('Some features may introduce significant technical debt');
    }

    if (features.length > 8) {
      risks.push('Large feature set may complicate initial launch');
    }

    if (features.some(f => f.category === 'enterprise')) {
      risks.push('Enterprise features require specialized expertise');
    }

    return risks;
  };

  const identifyOpportunities = (features: Feature[], projectType: string): string[] => {
    const opportunities: string[] = [];

    if (features.some(f => f.id === 'ai-analytics')) {
      opportunities.push('AI insights can drive data-driven product improvements');
    }

    if (features.some(f => f.id === 'real-time-collaboration')) {
      opportunities.push('Real-time features can command premium pricing');
    }

    if (features.some(f => f.id === 'advanced-3d')) {
      opportunities.push('3D experiences differentiate in competitive markets');
    }

    if (features.some(f => f.id === 'multi-tenancy')) {
      opportunities.push('Multi-tenancy enables scalable SaaS model');
    }

    return opportunities;
  };

  const addFeature = (feature: Feature) => {
    if (!selectedFeatures.find(f => f.id === feature.id)) {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const removeFeature = (featureId: string) => {
    setSelectedFeatures(selectedFeatures.filter(f => f.id !== featureId));
  };

  const totalDevTime = selectedFeatures.reduce((sum, f) => sum + f.developmentTime, 0);
  const avgROI = selectedFeatures.length > 0
    ? Math.round(selectedFeatures.reduce((sum, f) => sum + f.roi, 0) / selectedFeatures.length)
    : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Analysis Header */}
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-400" />
              <div>
                <CardTitle className="text-white">AI Feature Customizer</CardTitle>
                <CardDescription className="text-gray-300">
                  Let AI analyze your requirements and recommend the perfect feature combination
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={analyzeWithAI}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </div>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Custom Requirements Input */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            Tell AI About Your Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={customRequirements}
            onChange={(e) => setCustomRequirements(e.target.value)}
            placeholder="Describe your specific requirements, target audience, unique features, or constraints..."
            rows={3}
            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget Constraint
              </label>
              <select
                value={budgetConstraint}
                onChange={(e) => setBudgetConstraint(e.target.value)}
                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">No constraint</option>
                <option value="1000-10000">$1,000-$10,000</option>
                <option value="10000-50000">$10,000-$50,000</option>
                <option value="50000-100000">$50,000-$100,000</option>
                <option value="100000-200000">$100,000-$200,000</option>
                <option value="200000+">$200,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Timeline Constraint
              </label>
              <select
                value={timelineConstraint}
                onChange={(e) => setTimelineConstraint(e.target.value)}
                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">No constraint</option>
                <option value="2-4">2-4 weeks</option>
                <option value="4-8">4-8 weeks</option>
                <option value="8-16">8-16 weeks</option>
                <option value="16-24">3-6 months</option>
                <option value="24+">6+ months</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {aiRecommendation && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              AI Recommendations
              <Badge variant="outline" className="text-green-400 border-green-400">
                {aiRecommendation.confidence}% Confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-gray-300">{aiRecommendation.reasoning}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {aiRecommendation.estimatedRevenue}
                </div>
                <p className="text-sm text-gray-400">Estimated Revenue</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {aiRecommendation.developmentCost}
                </div>
                <p className="text-sm text-gray-400">Development Cost</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {aiRecommendation.timeline}
                </div>
                <p className="text-sm text-gray-400">Timeline</p>
              </div>
            </div>

            {aiRecommendation.opportunities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Opportunities</h4>
                <div className="space-y-1">
                  {aiRecommendation.opportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiRecommendation.risks.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Risks to Consider</h4>
                <div className="space-y-1">
                  {aiRecommendation.risks.map((risk, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Feature Selection */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-400" />
              Available Features
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{selectedFeatures.length} selected</span>
              <span>•</span>
              <span>{totalDevTime} weeks</span>
              <span>•</span>
              <span>{avgROI}% avg ROI</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURE_DATABASE.map((feature) => {
              const isSelected = selectedFeatures.some(f => f.id === feature.id);
              const isRecommended = aiRecommendation?.features.some(f => f.id === feature.id);

              return (
                <Card
                  key={feature.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10'
                      : isRecommended
                      ? 'border-green-500 bg-green-500/10 hover:border-green-600'
                      : 'border-gray-700 hover:border-gray-600 bg-white/5'
                  }`}
                  onClick={() => isSelected ? removeFeature(feature.id) : addFeature(feature)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{feature.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{feature.name}</h3>
                          <p className="text-xs text-gray-400 mt-1">{feature.description}</p>
                        </div>
                      </div>
                      {isRecommended && (
                        <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                          AI Recommended
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className={`text-xs ${feature.color} border-gray-600`}>
                        {feature.category}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${
                        feature.complexity === 'beginner' ? 'text-green-400 border-green-400' :
                        feature.complexity === 'intermediate' ? 'text-yellow-400 border-yellow-400' :
                        feature.complexity === 'advanced' ? 'text-orange-400 border-orange-400' :
                        'text-red-400 border-red-400'
                      }`}>
                        {feature.complexity}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${
                        feature.impact === 'critical' ? 'text-red-400 border-red-400' :
                        feature.impact === 'high' ? 'text-orange-400 border-orange-400' :
                        feature.impact === 'medium' ? 'text-yellow-400 border-yellow-400' :
                        'text-gray-400 border-gray-400'
                      }`}>
                        {feature.impact}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-4">
                        <span>📅 {feature.developmentTime} days</span>
                        <span>💰 {feature.cost}</span>
                        <span>📈 {feature.roi}% ROI</span>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {selectedFeatures.length > 0 && (
            <span>Selected features will be included in your project generation</span>
          )}
        </div>
        <Button
          onClick={() => onFeaturesSelected(selectedFeatures)}
          disabled={selectedFeatures.length === 0}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Rocket className="h-4 w-4 mr-2" />
          Generate with Selected Features
        </Button>
      </div>
    </div>
  );
}