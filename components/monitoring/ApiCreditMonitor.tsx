'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  DollarSign,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  PieChart,
  Target,
  Eye,
  Settings
} from 'lucide-react';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface ApiCreditUsage {
  providerId: string;
  providerName: string;
  modelId: string;
  modelName: string;
  tokensUsed: number;
  cost: number;
  timestamp: Date;
  requestId: string;
  status: 'success' | 'error' | 'pending';
  duration: number;
}

export interface ProviderCreditInfo {
  providerId: string;
  providerName: string;
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  currency: 'USD' | 'tokens';
  resetDate?: Date;
  dailyLimit?: number;
  monthlyLimit?: number;
  tier: 'free' | 'pro' | 'enterprise' | 'custom';
  lastUpdated: Date;
}

export interface CreditAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  providerId: string;
  message: string;
  threshold: number;
  currentUsage: number;
  timestamp: Date;
  acknowledged: boolean;
}

interface ApiCreditMonitorProps {
  userId: string;
  apiKeys: Array<{ id: string; providerId: string; name: string }>;
  onAlertTriggered: (alert: CreditAlert) => void;
  className?: string;
}

export function ApiCreditMonitor({ userId, apiKeys, onAlertTriggered, className = '' }: ApiCreditMonitorProps) {
  const [creditInfo, setCreditInfo] = useState<ProviderCreditInfo[]>([]);
  const [recentUsage, setRecentUsage] = useState<ApiCreditUsage[]>([]);
  const [alerts, setAlerts] = useState<CreditAlert[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadCreditInfo();
    loadRecentUsage();
    checkCreditThresholds();

    // Set up real-time monitoring
    const interval = setInterval(() => {
      loadCreditInfo();
      loadRecentUsage();
      checkCreditThresholds();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [userId, apiKeys]);

  const loadCreditInfo = async () => {
    // Simulate loading credit information from API providers
    const mockCreditInfo: ProviderCreditInfo[] = [
      {
        providerId: 'openai',
        providerName: 'OpenAI',
        totalCredits: 100,
        usedCredits: 67.45,
        remainingCredits: 32.55,
        currency: 'USD',
        monthlyLimit: 100,
        tier: 'pro',
        lastUpdated: new Date()
      },
      {
        providerId: 'anthropic',
        providerName: 'Anthropic Claude',
        totalCredits: 50,
        usedCredits: 23.89,
        remainingCredits: 26.11,
        currency: 'USD',
        monthlyLimit: 50,
        tier: 'pro',
        lastUpdated: new Date()
      },
      {
        providerId: 'google',
        providerName: 'Google Gemini',
        totalCredits: 25,
        usedCredits: 8.34,
        remainingCredits: 16.66,
        currency: 'USD',
        monthlyLimit: 25,
        tier: 'free',
        lastUpdated: new Date()
      },
      {
        providerId: 'groq',
        providerName: 'Groq',
        totalCredits: 1000000, // in tokens
        usedCredits: 245678,
        remainingCredits: 754322,
        currency: 'tokens',
        monthlyLimit: 1000000,
        tier: 'free',
        lastUpdated: new Date()
      }
    ];

    setCreditInfo(mockCreditInfo);
  };

  const loadRecentUsage = async () => {
    // Simulate loading recent usage data
    const now = new Date();
    const mockUsage: ApiCreditUsage[] = [];

    // Generate usage data for the last 24 hours
    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
      const provider = mockCreditInfo[Math.floor(Math.random() * mockCreditInfo.length)];

      const usage: ApiCreditUsage = {
        providerId: provider.providerId,
        providerName: provider.providerName,
        modelId: `${provider.providerId}-model-${Math.floor(Math.random() * 3) + 1}`,
        modelName: `Model ${Math.floor(Math.random() * 3) + 1}`,
        tokensUsed: Math.floor(Math.random() * 5000) + 100,
        cost: Math.random() * 0.5 + 0.01,
        timestamp,
        requestId: `req_${Date.now()}_${i}`,
        status: Math.random() > 0.1 ? 'success' : 'error',
        duration: Math.floor(Math.random() * 3000) + 500
      };
      mockUsage.push(usage);
    }

    mockUsage.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setRecentUsage(mockUsage);
  };

  const checkCreditThresholds = () => {
    const newAlerts: CreditAlert[] = [];

    creditInfo.forEach(info => {
      const usagePercentage = (info.usedCredits / info.totalCredits) * 100;

      // Critical alert (90%+)
      if (usagePercentage >= 90) {
        newAlerts.push({
          id: `critical-${info.providerId}-${Date.now()}`,
          type: 'critical',
          providerId: info.providerId,
          message: `Critical: ${info.providerName} credits almost depleted (${usagePercentage.toFixed(1)}% used)`,
          threshold: 90,
          currentUsage: usagePercentage,
          timestamp: new Date(),
          acknowledged: false
        });
      }
      // Warning alert (75%+)
      else if (usagePercentage >= 75) {
        newAlerts.push({
          id: `warning-${info.providerId}-${Date.now()}`,
          type: 'warning',
          providerId: info.providerId,
          message: `Warning: ${info.providerName} credits running low (${usagePercentage.toFixed(1)}% used)`,
          threshold: 75,
          currentUsage: usagePercentage,
          timestamp: new Date(),
          acknowledged: false
        });
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev.filter(a => !a.acknowledged)]);
      newAlerts.forEach(alert => onAlertTriggered(alert));
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadCreditInfo(),
      loadRecentUsage(),
      checkCreditThresholds()
    ]);
    setIsRefreshing(false);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const getUsagePercentage = (info: ProviderCreditInfo) => {
    return (info.usedCredits / info.totalCredits) * 100;
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 75) return 'text-yellow-400';
    if (percentage >= 50) return 'text-orange-400';
    return 'text-green-400';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getFilteredUsage = () => {
    const now = new Date();
    let cutoffTime = new Date();

    switch (timeRange) {
      case 'hour':
        cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'day':
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    let filtered = recentUsage.filter(usage => usage.timestamp >= cutoffTime);

    if (selectedProvider !== 'all') {
      filtered = filtered.filter(usage => usage.providerId === selectedProvider);
    }

    return filtered;
  };

  const calculateTotalCost = () => {
    return getFilteredUsage().reduce((sum, usage) => sum + usage.cost, 0);
  };

  const calculateTotalTokens = () => {
    return getFilteredUsage().reduce((sum, usage) => sum + usage.tokensUsed, 0);
  };

  const getActiveProviders = () => {
    const activeProviders = new Set(getFilteredUsage().map(usage => usage.providerId));
    return Array.from(activeProviders);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }
    return amount.toLocaleString();
  };

  const filteredUsage = getFilteredUsage();
  const totalCost = calculateTotalCost();
  const totalTokens = calculateTotalTokens();
  const activeProviders = getActiveProviders();

  return (
    <div className={`h-full bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-purple-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">API Credit Monitor</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-purple-300 border-purple-400">
                  {activeProviders.length} active providers
                </Badge>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {filteredUsage.length} requests
                </Badge>
                {alerts.some(a => !a.acknowledged) && (
                  <Badge variant="outline" className="text-red-400 border-red-400">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {alerts.filter(a => !a.acknowledged).length} alerts
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-1 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
              >
                <option value="hour">Last Hour</option>
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
              <Button
                onClick={refreshData}
                disabled={isRefreshing}
                variant="outline"
                className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="outline"
                className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
              >
                <Settings className="h-4 w-4 mr-2" />
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.some(a => !a.acknowledged) && (
          <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4">
            <div className="space-y-2">
              {alerts.filter(a => !a.acknowledged).map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    alert.type === 'critical'
                      ? 'bg-red-900/20 border-red-500/30'
                      : 'bg-yellow-900/20 border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.type === 'critical' ? 'text-red-400' : 'text-yellow-400'
                    }`} />
                    <span className={`text-sm ${
                      alert.type === 'critical' ? 'text-red-300' : 'text-yellow-300'
                    }`}>
                      {alert.message}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.id)}
                    variant="outline"
                    className="border-red-500/20 text-red-300 hover:bg-red-800/20"
                  >
                    Acknowledge
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-300">Total Cost</span>
              </div>
              <div className="text-xl font-bold text-white">
                {formatCurrency(totalCost)}
              </div>
              <div className="text-xs text-purple-400">
                {timeRange === 'hour' ? 'Last hour' :
                 timeRange === 'day' ? 'Last 24 hours' :
                 timeRange === 'week' ? 'Last 7 days' : 'Last 30 days'}
              </div>
            </div>
            <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-300">Total Tokens</span>
              </div>
              <div className="text-xl font-bold text-white">
                {totalTokens.toLocaleString()}
              </div>
              <div className="text-xs text-purple-400">
                Across all providers
              </div>
            </div>
            <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-300">Avg Cost/1k Tokens</span>
              </div>
              <div className="text-xl font-bold text-white">
                {totalTokens > 0 ? formatCurrency((totalCost / totalTokens) * 1000) : '$0.00'}
              </div>
              <div className="text-xs text-purple-400">
                Cost efficiency
              </div>
            </div>
            <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-300">Success Rate</span>
              </div>
              <div className="text-xl font-bold text-white">
                {filteredUsage.length > 0
                  ? ((filteredUsage.filter(u => u.status === 'success').length / filteredUsage.length) * 100).toFixed(1)
                  : '0'}%
              </div>
              <div className="text-xs text-purple-400">
                Request success rate
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Provider Breakdown */}
          <div className={`${showDetails ? 'w-96' : 'w-64'} bg-black/20 border-r border-purple-500/20 p-4 overflow-auto`}>
            <h3 className="text-sm font-semibold text-white mb-4">Credit Usage by Provider</h3>
            <div className="space-y-4">
              {creditInfo.map(info => {
                const usagePercentage = getUsagePercentage(info);
                const providerUsage = filteredUsage.filter(u => u.providerId === info.providerId);
                const providerCost = providerUsage.reduce((sum, u) => sum + u.cost, 0);
                const providerTokens = providerUsage.reduce((sum, u) => sum + u.tokensUsed, 0);

                return (
                  <Card key={info.providerId} className="bg-black/40 backdrop-blur-sm border-purple-500/20">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-white">{info.providerName}</h4>
                        <Badge variant="outline" className={`text-xs ${getUsageColor(usagePercentage)} border-current`}>
                          {usagePercentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs text-purple-300 mb-1">
                            <span>Credits Used</span>
                            <span>{formatCurrency(info.usedCredits, info.currency)}</span>
                          </div>
                          <Progress
                            value={usagePercentage}
                            className={`h-2 ${getProgressColor(usagePercentage)}`}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-purple-300">
                          <span>Remaining</span>
                          <span>{formatCurrency(info.remainingCredits, info.currency)}</span>
                        </div>
                        {showDetails && (
                          <>
                            <div className="flex justify-between text-xs text-purple-300">
                              <span>Period Cost</span>
                              <span>{formatCurrency(providerCost)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-purple-300">
                              <span>Period Tokens</span>
                              <span>{providerTokens.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-purple-300">
                              <span>Requests</span>
                              <span>{providerUsage.length}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Usage Table */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Recent API Usage</h3>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="px-3 py-1 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
              >
                <option value="all">All Providers</option>
                {creditInfo.map(info => (
                  <option key={info.providerId} value={info.providerId}>
                    {info.providerName}
                  </option>
                ))}
              </select>
            </div>

            {filteredUsage.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-300">No usage data available</p>
                  <p className="text-sm text-purple-400">
                    API requests will appear here in real-time
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-purple-500/20">
                      <th className="text-left py-2 px-3 text-purple-300">Time</th>
                      <th className="text-left py-2 px-3 text-purple-300">Provider</th>
                      <th className="text-left py-2 px-3 text-purple-300">Model</th>
                      <th className="text-right py-2 px-3 text-purple-300">Tokens</th>
                      <th className="text-right py-2 px-3 text-purple-300">Cost</th>
                      <th className="text-right py-2 px-3 text-purple-300">Duration</th>
                      <th className="text-center py-2 px-3 text-purple-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsage.map((usage, index) => (
                      <tr key={`${usage.requestId}-${index}`} className="border-b border-purple-500/10">
                        <td className="py-2 px-3 text-purple-200">
                          {usage.timestamp.toLocaleTimeString()}
                        </td>
                        <td className="py-2 px-3 text-purple-200">{usage.providerName}</td>
                        <td className="py-2 px-3 text-purple-200">{usage.modelName}</td>
                        <td className="py-2 px-3 text-right text-purple-200">
                          {usage.tokensUsed.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right text-purple-200">
                          {formatCurrency(usage.cost)}
                        </td>
                        <td className="py-2 px-3 text-right text-purple-200">
                          {usage.duration}ms
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Badge variant="outline" className={
                            usage.status === 'success'
                              ? 'text-green-400 border-green-400'
                              : 'text-red-400 border-red-400'
                          }>
                            {usage.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}