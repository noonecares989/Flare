'use client';

import { useState, useEffect } from 'react';
import {
  Key,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Zap,
  Shield,
  CreditCard,
  Sparkles,
  Settings,
  ExternalLink,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { MagicalButton3D } from '@/components/ui/MagicalButton3D';
import { MagicalCard3D } from '@/components/ui/MagicalCard3D';
import { AnimatedBackground } from '@/components/3d/AnimatedBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface CloserouterStatus {
  configured: boolean;
  provider: string;
  models: Array<{
    id: string;
    name: string;
    contextWindow: number;
    costPerToken: number;
    capabilities: string[];
  }>;
  usage: {
    totalTokens: number;
    totalCost: number;
    requestCount: number;
  };
}

export function CloserouterConfig({ userId }: { userId: string }) {
  const [status, setStatus] = useState<CloserouterStatus | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
  }, [userId]);

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/closerouter/config');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error checking Closerouter status:', error);
    }
  };

  const configureCloserouter = async () => {
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/closerouter/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          config: {
            timeout: 30000,
            maxRetries: 3
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus({
          configured: true,
          provider: 'closerouter',
          models: data.models,
          usage: {
            totalTokens: 0,
            totalCost: 0,
            requestCount: 0
          }
        });
        setSuccess('Closerouter configured successfully!');
        setApiKey('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to configure Closerouter');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeConfiguration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/closerouter/config', {
        method: 'DELETE',
      });

      if (response.ok) {
        setStatus(null);
        setSuccess('Closerouter configuration removed');
      }
    } catch (error) {
      setError('Failed to remove configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
  };

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cost);
  };

  const getModelIcon = (modelId: string) => {
    if (modelId.includes('gpt')) return '🤖';
    if (modelId.includes('claude')) return '🧠';
    if (modelId.includes('gemini')) return '💎';
    if (modelId.includes('grok')) return '⚡';
    if (modelId.includes('llama')) return '🦙';
    return '🔮';
  };

  return (
    <div className="h-full bg-gradient-to-br from-violet-900/50 via-purple-900/50 to-indigo-900/50 relative">
      <AnimatedBackground
        colorScheme="cyber"
        intensity="medium"
        className="absolute inset-0"
      />
      <div className="h-full flex flex-col relative z-10">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-violet-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-violet-400" />
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                  status?.configured ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                }`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Closerouter AI</h2>
                <p className="text-sm text-violet-300">Multi-provider AI with free credits</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {status && (
                  <div className="text-right">
                    <div className="text-sm text-violet-300">Total Usage</div>
                    <div className="text-lg font-bold text-green-400">
                      {formatCost(status.usage.totalCost)}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs text-cyan-300">
                  <span className="text-cyan-400">👑</span> Created by CyberSultan
                </div>
                <WitchcraftButton
                  onClick={checkStatus}
                  spellType="enchantment"
                  size="sm"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </WitchcraftButton>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Status Card */}
            <Card className="bg-black/40 backdrop-blur-sm border-violet-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings className="h-5 w-5 text-violet-400" />
                      Configuration Status
                    </CardTitle>
                    <CardDescription className="text-violet-300">
                      Current Closerouter AI configuration status
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={
                    status?.configured
                      ? 'text-green-400 border-green-400'
                      : 'text-gray-400 border-gray-400'
                  }>
                    {status?.configured ? 'Configured' : 'Not Configured'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {status?.configured ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <span>Closerouter AI is configured and ready to use</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-violet-800/20 border border-violet-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-violet-400" />
                          <span className="text-sm text-violet-300">Total Requests</span>
                        </div>
                        <div className="text-xl font-bold text-white">
                          {status.usage.requestCount.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-violet-800/20 border border-violet-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-violet-400" />
                          <span className="text-sm text-violet-300">Total Cost</span>
                        </div>
                        <div className="text-xl font-bold text-white">
                          {formatCost(status.usage.totalCost)}
                        </div>
                      </div>
                      <div className="bg-violet-800/20 border border-violet-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-violet-400" />
                          <span className="text-sm text-violet-300">Available Models</span>
                        </div>
                        <div className="text-xl font-bold text-white">
                          {status.models.length}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={removeConfiguration}
                        variant="outline"
                        className="border-red-500/20 text-red-300 hover:bg-red-800/20"
                        disabled={isLoading}
                      >
                        Remove Configuration
                      </Button>
                      <a
                        href="https://closerouter.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-violet-500/20 text-violet-300 rounded-lg hover:bg-violet-800/20 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit Dashboard
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <AlertCircle className="h-5 w-5" />
                      <span>Closerouter AI is not configured yet</span>
                    </div>
                    <p className="text-sm text-violet-300">
                      Configure your Closerouter API key to access multiple AI providers with free credits
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuration Form */}
            {!status?.configured && (
              <Card className="bg-black/40 backdrop-blur-sm border-violet-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Configure Closerouter AI</CardTitle>
                  <CardDescription className="text-violet-300">
                    Enter your Closerouter API key to enable multi-provider AI access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-violet-300 mb-2">
                      Closerouter API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="cr_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2 pr-24 bg-violet-900/50 border border-violet-500/20 rounded-lg text-white placeholder-violet-400 focus:outline-none focus:border-violet-400"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="h-8 w-8 p-0 text-violet-300 hover:bg-violet-800/20"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={copyApiKey}
                          className="h-8 w-8 p-0 text-violet-300 hover:bg-violet-800/20"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-violet-400 mt-2">
                      Get your API key from{' '}
                      <a
                        href="https://closerouter.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-300 hover:text-violet-200 underline"
                      >
                        Closerouter Dashboard
                      </a>
                    </p>
                  </div>

                  {/* Features */}
                  <div className="bg-violet-800/20 border border-violet-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-violet-300 mb-3">Why Closerouter AI?</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-violet-200">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>Free starting credits</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-violet-200">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>Access to multiple AI providers</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-violet-200">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>Automatic fallback models</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-violet-200">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>Cost optimization</span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{success}</span>
                      </div>
                    </div>
                  )}

                  <WitchcraftButton
                    onClick={configureCloserouter}
                    spellType="enchantment"
                    disabled={!apiKey.trim() || isLoading}
                    className="w-full"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    {isLoading ? 'Configuring...' : 'Configure Closerouter AI'}
                  </WitchcraftButton>
                </CardContent>
              </Card>
            )}

            {/* Available Models */}
            {status?.models && status.models.length > 0 && (
              <Card className="bg-black/40 backdrop-blur-sm border-violet-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Available Models</CardTitle>
                  <CardDescription className="text-violet-300">
                    AI models accessible through your Closerouter configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {status.models.map((model) => (
                      <div
                        key={model.id}
                        className="bg-violet-800/20 border border-violet-500/20 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{getModelIcon(model.id)}</span>
                          <div>
                            <h4 className="font-medium text-white">{model.name}</h4>
                            <p className="text-xs text-violet-400">{model.id}</p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-violet-300">Context Window:</span>
                            <span className="text-white">
                              {model.contextWindow.toLocaleString()} tokens
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-violet-300">Cost per Token:</span>
                            <span className="text-white">
                              {formatCost(model.costPerToken)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {model.capabilities.map((capability) => (
                            <Badge
                              key={capability}
                              variant="outline"
                              className="text-xs text-violet-300 border-violet-500/30"
                            >
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}