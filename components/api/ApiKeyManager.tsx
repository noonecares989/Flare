'use client';

import { useState, useEffect } from 'react';
import {
  Key,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Zap,
  TrendingUp,
  RefreshCw,
  Shield,
  Copy,
  ExternalLink
} from 'lucide-react';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export interface ApiProvider {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  keyPattern: RegExp;
  supportedModels: string[];
  maxTokens: number;
  icon: string;
  color: string;
  features: string[];
  pricing?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface ApiKey {
  id: string;
  providerId: string;
  name: string;
  apiKey: string;
  isActive: boolean;
  creditsUsed: number;
  creditsLimit?: number;
  lastUsed?: Date;
  createdAt: Date;
  usageHistory: Array<{
    timestamp: Date;
    tokens: number;
    cost: number;
    model: string;
  }>;
}

export interface ApiUsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  providersUsage: Record<string, {
    requests: number;
    tokens: number;
    cost: number;
  }>;
  modelUsage: Record<string, {
    requests: number;
    tokens: number;
    cost: number;
  }>;
}

interface ApiKeyManagerProps {
  userId: string;
  onKeysUpdate: (keys: ApiKey[]) => void;
  className?: string;
}

export function ApiKeyManager({ userId, onKeysUpdate, className = '' }: ApiKeyManagerProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [newKeyName, setNewKeyName] = useState('');
  const [newApiKeyValue, setNewApiKeyValue] = useState('');
  const [usageStats, setUsageStats] = useState<ApiUsageStats | null>(null);
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);

  const apiProviders: ApiProvider[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4, GPT-3.5 Turbo, DALL-E models',
      baseUrl: 'https://api.openai.com/v1',
      keyPattern: /^sk-[A-Za-z0-9]{48}$/,
      supportedModels: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'dall-e-3', 'gpt-4-vision-preview'],
      maxTokens: 128000,
      icon: '🤖',
      color: 'text-green-400',
      features: ['Chat', 'Code Generation', 'Image Generation', 'Vision'],
      pricing: {
        inputTokens: 0.00001,
        outputTokens: 0.00003
      }
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      description: 'Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku',
      baseUrl: 'https://api.anthropic.com/v1',
      keyPattern: /^sk-ant-api03-[A-Za-z0-9_-]{95}$/,
      supportedModels: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
      maxTokens: 200000,
      icon: '🧠',
      color: 'text-purple-400',
      features: ['Chat', 'Code Generation', 'Analysis', 'Long Context'],
      pricing: {
        inputTokens: 0.000015,
        outputTokens: 0.000075
      }
    },
    {
      id: 'google',
      name: 'Google Gemini',
      description: 'Gemini Pro, Gemini Pro Vision, Gemini Ultra',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      keyPattern: /^[A-Za-z0-9_-]{39}$/,
      supportedModels: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro-vision'],
      maxTokens: 2000000,
      icon: '💎',
      color: 'text-blue-400',
      features: ['Chat', 'Code Generation', 'Vision', 'Long Context'],
      pricing: {
        inputTokens: 0.00000125,
        outputTokens: 0.000005
      }
    },
    {
      id: 'groq',
      name: 'Groq',
      description: 'Ultra-fast inference with Llama, Mixtral models',
      baseUrl: 'https://api.groq.com/openai/v1',
      keyPattern: /^gsk_[A-Za-z0-9]{52}$/,
      supportedModels: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
      maxTokens: 131072,
      icon: '⚡',
      color: 'text-orange-400',
      features: ['Chat', 'Code Generation', 'Speed'],
      pricing: {
        inputTokens: 0.0000005,
        outputTokens: 0.0000008
      }
    },
    {
      id: 'cohere',
      name: 'Cohere',
      description: 'Command R+, Command, Embed models',
      baseUrl: 'https://api.cohere.ai/v1',
      keyPattern: /^[A-Za-z0-9]{40}$/,
      supportedModels: ['command-r-plus', 'command', 'command-nightly', 'embed-english-v3.0'],
      maxTokens: 128000,
      icon: '🎯',
      color: 'text-indigo-400',
      features: ['Chat', 'Code Generation', 'Embeddings', 'RAG'],
      pricing: {
        inputTokens: 0.0000005,
        outputTokens: 0.0000015
      }
    },
    {
      id: 'mistral',
      name: 'Mistral AI',
      description: 'Mistral Large, Mixtral, Codestral models',
      baseUrl: 'https://api.mistral.ai/v1',
      keyPattern: /^[A-Za-z0-9]{32}$/,
      supportedModels: ['mistral-large-latest', 'mixtral-8x7b', 'codestral-latest'],
      maxTokens: 32000,
      icon: '🌊',
      color: 'text-cyan-400',
      features: ['Chat', 'Code Generation', 'Multilingual'],
      pricing: {
        inputTokens: 0.000008,
        outputTokens: 0.000024
      }
    },
    {
      id: 'closerouter',
      name: 'Closerouter.com',
      description: 'Free AI models from Closerouter.com - Add your API key from closerouter.com',
      baseUrl: 'https://api.closerouter.com/v1',
      keyPattern: /^cr_[A-Za-z0-9_-]{32,}$/,
      supportedModels: [
        'claude-3-5-sonnet',
        'gpt-4',
        'gpt-4-turbo',
        'gemini-pro',
        'gemini-1.5-pro',
        'grok-beta',
        'llama-3.1-70b',
        'mixtral-8x7b',
        'claude-3-opus',
        'claude-3-sonnet',
        'claude-3-haiku',
        'gpt-3.5-turbo'
      ],
      maxTokens: 1048576,
      icon: '🔮',
      color: 'text-violet-400',
      features: ['Chat', 'Code Generation', 'Free Credits', 'Multi-Provider', 'All AI Models', 'Auto-Fallback'],
      pricing: {
        inputTokens: 0.000001, // Much cheaper with free credits
        outputTokens: 0.000002
      },
      externalUrl: 'https://closerouter.com'
    }
  ];

  useEffect(() => {
    loadApiKeys();
    loadUsageStats();
  }, [userId]);

  const loadApiKeys = () => {
    // Load from localStorage or API
    const storedKeys = localStorage.getItem(`api_keys_${userId}`);
    if (storedKeys) {
      setApiKeys(JSON.parse(storedKeys));
    } else {
      // Initialize with demo data
      const demoKeys: ApiKey[] = [
        {
          id: 'demo-openai',
          providerId: 'openai',
          name: 'OpenAI GPT-4 Key',
          apiKey: 'sk-demo-key-replace-with-real-key',
          isActive: true,
          creditsUsed: 12345,
          creditsLimit: 100000,
          lastUsed: new Date(),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          usageHistory: [
            {
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              tokens: 1500,
              cost: 0.045,
              model: 'gpt-4'
            },
            {
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
              tokens: 2000,
              cost: 0.06,
              model: 'gpt-4-turbo'
            }
          ]
        }
      ];
      setApiKeys(demoKeys);
    }
  };

  const loadUsageStats = async () => {
    setIsRefreshingStats(true);

    // Calculate usage stats from API keys
    const stats: ApiUsageStats = {
      totalRequests: apiKeys.reduce((sum, key) =>
        sum + key.usageHistory.length, 0
      ),
      totalTokens: apiKeys.reduce((sum, key) =>
        sum + key.usageHistory.reduce((s, usage) => s + usage.tokens, 0), 0
      ),
      totalCost: apiKeys.reduce((sum, key) =>
        sum + key.usageHistory.reduce((s, usage) => s + usage.cost, 0), 0
      ),
      providersUsage: {},
      modelUsage: {}
    };

    // Calculate provider usage
    apiKeys.forEach(key => {
      const provider = apiProviders.find(p => p.id === key.providerId);
      if (provider) {
        stats.providersUsage[provider.id] = {
          requests: key.usageHistory.length,
          tokens: key.usageHistory.reduce((s, usage) => s + usage.tokens, 0),
          cost: key.usageHistory.reduce((s, usage) => s + usage.cost, 0)
        };
      }
    });

    // Calculate model usage
    apiKeys.forEach(key => {
      key.usageHistory.forEach(usage => {
        if (!stats.modelUsage[usage.model]) {
          stats.modelUsage[usage.model] = {
            requests: 0,
            tokens: 0,
            cost: 0
          };
        }
        stats.modelUsage[usage.model].requests++;
        stats.modelUsage[usage.model].tokens += usage.tokens;
        stats.modelUsage[usage.model].cost += usage.cost;
      });
    });

    setUsageStats(stats);
    setIsRefreshingStats(false);
  };

  const addApiKey = () => {
    if (!selectedProvider || !newKeyName.trim() || !newApiKeyValue.trim()) {
      return;
    }

    const provider = apiProviders.find(p => p.id === selectedProvider);
    if (!provider) return;

    // Validate API key format
    if (!provider.keyPattern.test(newApiKeyValue)) {
      alert(`Invalid API key format for ${provider.name}`);
      return;
    }

    const newKey: ApiKey = {
      id: `${selectedProvider}-${Date.now()}`,
      providerId: selectedProvider,
      name: newKeyName.trim(),
      apiKey: newApiKeyValue.trim(),
      isActive: true,
      creditsUsed: 0,
      createdAt: new Date(),
      usageHistory: []
    };

    const updatedKeys = [...apiKeys, newKey];
    setApiKeys(updatedKeys);
    localStorage.setItem(`api_keys_${userId}`, JSON.stringify(updatedKeys));
    onKeysUpdate(updatedKeys);

    // Reset form
    setNewKeyName('');
    setNewApiKeyValue('');
    setSelectedProvider('');
    setIsAddingKey(false);
  };

  const removeApiKey = (keyId: string) => {
    const updatedKeys = apiKeys.filter(key => key.id !== keyId);
    setApiKeys(updatedKeys);
    localStorage.setItem(`api_keys_${userId}`, JSON.stringify(updatedKeys));
    onKeysUpdate(updatedKeys);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
  };

  const getProviderById = (providerId: string) => {
    return apiProviders.find(p => p.id === providerId);
  };

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cost);
  };

  const getCreditUsagePercentage = (key: ApiKey) => {
    if (!key.creditsLimit) return 0;
    return (key.creditsUsed / key.creditsLimit) * 100;
  };

  return (
    <div className={`h-full bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Key className="h-8 w-8 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">API Key Management</h2>
                <p className="text-sm text-purple-300">Manage your AI provider API keys and monitor usage</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {usageStats && (
                <div className="text-right">
                  <div className="text-sm text-purple-300">Total Cost This Month</div>
                  <div className="text-lg font-bold text-green-400">
                    {formatCost(usageStats.totalCost)}
                  </div>
                </div>
              )}
              <WitchcraftButton
                onClick={loadUsageStats}
                spellType="enchantment"
                size="sm"
                disabled={isRefreshingStats}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshingStats ? 'animate-spin' : ''}`} />
                Refresh Stats
              </WitchcraftButton>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        {usageStats && (
          <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Total Requests</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {usageStats.totalRequests.toLocaleString()}
                </div>
              </div>
              <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Total Tokens</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {usageStats.totalTokens.toLocaleString()}
                </div>
              </div>
              <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Active Keys</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {apiKeys.filter(k => k.isActive).length}
                </div>
              </div>
              <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Total Providers</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {new Set(apiKeys.map(k => k.providerId)).size}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Add New Key Section */}
            <div className="mb-6">
              {!isAddingKey ? (
                <WitchcraftButton
                  onClick={() => setIsAddingKey(true)}
                  spellType="enchantment"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New API Key
                </WitchcraftButton>
              ) : (
                <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Add New API Key</CardTitle>
                    <CardDescription className="text-purple-300">
                      Add your API key from an AI provider to enable advanced features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Select Provider
                      </label>
                      <select
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="w-full px-4 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      >
                        <option value="">Choose a provider...</option>
                        {apiProviders.map(provider => (
                          <option key={provider.id} value={provider.id}>
                            {provider.icon} {provider.name} - {provider.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Key Name
                      </label>
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g., My OpenAI GPT-4 Key"
                        className="w-full px-4 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        API Key
                      </label>
                      <input
                        type="password"
                        value={newApiKeyValue}
                        onChange={(e) => setNewApiKeyValue(e.target.value)}
                        placeholder="Enter your API key"
                        className="w-full px-4 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    {selectedProvider && (
                      <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium text-purple-300">
                            Provider Information
                          </span>
                        </div>
                        <div className="text-xs text-purple-200 space-y-1">
                          <p><strong>Models:</strong> {getProviderById(selectedProvider)?.supportedModels.join(', ')}</p>
                          <p><strong>Max Tokens:</strong> {getProviderById(selectedProvider)?.maxTokens.toLocaleString()}</p>
                          <p><strong>Features:</strong> {getProviderById(selectedProvider)?.features.join(', ')}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <WitchcraftButton
                        onClick={addApiKey}
                        spellType="enchantment"
                        disabled={!selectedProvider || !newKeyName.trim() || !newApiKeyValue.trim()}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Add Key
                      </WitchcraftButton>
                      <Button
                        onClick={() => setIsAddingKey(false)}
                        variant="outline"
                        className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* API Keys List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Your API Keys</h3>
              {apiKeys.length === 0 ? (
                <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
                  <CardContent className="p-8 text-center">
                    <Key className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-purple-300">No API keys configured yet</p>
                    <p className="text-sm text-purple-400 mt-2">
                      Add your first API key to start using advanced AI features
                    </p>
                  </CardContent>
                </Card>
              ) : (
                apiKeys.map(key => {
                  const provider = getProviderById(key.providerId);
                  const usagePercentage = getCreditUsagePercentage(key);

                  return (
                    <Card key={key.id} className="bg-black/40 backdrop-blur-sm border-purple-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600/20">
                              <span className="text-2xl">{provider?.icon}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-semibold text-white">{key.name}</h4>
                                <Badge variant="outline" className={provider?.color}>
                                  {provider?.name}
                                </Badge>
                                {key.isActive && (
                                  <Badge variant="outline" className="text-green-400 border-green-400">
                                    Active
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-purple-300">
                                Created: {key.createdAt.toLocaleDateString()}
                                {key.lastUsed && ` • Last used: ${key.lastUsed.toLocaleDateString()}`}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Usage Stats */}
                            <div className="text-right">
                              <div className="text-sm text-purple-300">Usage</div>
                              <div className="text-lg font-bold text-purple-300">
                                {key.creditsUsed.toLocaleString()} tokens
                              </div>
                              {key.creditsLimit && (
                                <div className="text-xs text-purple-400">
                                  of {key.creditsLimit.toLocaleString()}
                                </div>
                              )}
                            </div>

                            {/* Progress Bar */}
                            {key.creditsLimit && (
                              <div className="w-32">
                                <div className="text-xs text-purple-300 mb-1">Credit Usage</div>
                                <Progress
                                  value={usagePercentage}
                                  className={`h-2 ${
                                    usagePercentage > 80 ? 'bg-red-900/50' :
                                    usagePercentage > 60 ? 'bg-yellow-900/50' : 'bg-green-900/50'
                                  }`}
                                />
                                <div className="text-xs text-purple-400 mt-1">
                                  {usagePercentage.toFixed(1)}%
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleKeyVisibility(key.id)}
                                className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
                              >
                                {showKey[key.id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyApiKey(key.apiKey)}
                                className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeApiKey(key.id)}
                                className="border-red-500/20 text-red-300 hover:bg-red-800/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* API Key Display */}
                        {showKey[key.id] && (
                          <div className="mt-4 p-3 bg-purple-900/30 border border-purple-500/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <code className="text-sm text-purple-200 font-mono">
                                {key.apiKey}
                              </code>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs text-purple-300">
                                  {provider?.id}
                                </Badge>
                                <a
                                  href={provider?.baseUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-400 hover:text-purple-300"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Recent Usage */}
                        {key.usageHistory.length > 0 && (
                          <div className="mt-4">
                            <div className="text-sm font-medium text-purple-300 mb-2">Recent Usage</div>
                            <div className="space-y-1">
                              {key.usageHistory.slice(0, 3).map((usage, index) => (
                                <div key={index} className="flex items-center justify-between text-xs text-purple-400">
                                  <span>{usage.model} • {usage.tokens.toLocaleString()} tokens</span>
                                  <span>{formatCost(usage.cost)} • {usage.timestamp.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}