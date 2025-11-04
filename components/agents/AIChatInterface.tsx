'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, CheckCircle, AlertCircle, Clock, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { multiAgentOrchestrator } from '@/lib/ai/orchestrator';
import { AgentType } from '@/lib/ai/agentConfigs';
import { getContextualPrompt } from '@/lib/ai/enhancedPrompts';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  agentType?: AgentType;
  status?: 'sending' | 'sent' | 'error' | 'completed';
  metadata?: any;
}

interface AIChatInterfaceProps {
  projectId: string;
  sessionId: string;
  initialMessage?: string;
  className?: string;
}

export function AIChatInterface({
  projectId,
  sessionId,
  initialMessage = '',
  className = ''
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState(initialMessage);
  const [isTyping, setIsTyping] = useState(false);
  const [agentSessionId, setAgentSessionId] = useState<string | null>(null);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessage) {
      handleSubmit(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Start multi-agent workflow
      const sessionId_result = await multiAgentOrchestrator.executeAgentWorkflow({
        sessionId,
        projectId,
        userId: 'demo-user', // Would come from actual session
        prompt: content,
        context: {
          timestamp: new Date().toISOString(),
          previousMessages: messages.slice(-5), // Last 5 messages for context
        },
      });

      setAgentSessionId(sessionId_result);

      // Add system message about workflow starting
      const systemMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'agent',
        content: '🚀 Starting multi-agent workflow... Analyzing requirements and selecting optimal AI models.',
        timestamp: new Date(),
        status: 'sent',
        metadata: { type: 'workflow-start', sessionId: sessionId_result }
      };

      setMessages(prev => [...prev, systemMessage]);

      // Simulate agent updates
      simulateAgentWorkflow(sessionId_result, content);

    } catch (error) {
      console.error('Failed to start AI workflow:', error);

      const errorMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'agent',
        content: '❌ Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
        status: 'error',
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const simulateAgentWorkflow = async (sessionId: string, userPrompt: string) => {
    // Simulate the multi-agent process
    const agents = [
      { type: AgentType.PLANNER, delay: 2000, duration: 4000 },
      { type: AgentType.FRONTEND_CODER, delay: 1000, duration: 6000 },
      { type: AgentType.BACKEND_CODER, delay: 1000, duration: 6000 },
      { type: AgentType.DB_DESIGNER, delay: 500, duration: 3000 },
    ];

    // Filter agents based on prompt analysis
    const relevantAgents = agents.filter(agent => {
      const promptLower = userPrompt.toLowerCase();
      switch (agent.type) {
        case AgentType.PLANNER:
          return true; // Always needed
        case AgentType.FRONTEND_CODER:
          return promptLower.includes('ui') || promptLower.includes('frontend') || promptLower.includes('react');
        case AgentType.BACKEND_CODER:
          return promptLower.includes('api') || promptLower.includes('backend') || promptLower.includes('server');
        case AgentType.DB_DESIGNER:
          return promptLower.includes('database') || promptLower.includes('schema') || promptLower.includes('sql');
        default:
          return false;
      }
    });

    setActiveAgents(relevantAgents.map(agent => agent.type));

    // Simulate each agent working
    for (const agent of relevantAgents) {
      await new Promise(resolve => setTimeout(resolve, agent.delay));

      // Agent starts
      const startMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'agent',
        content: `🤖 ${agent.type.replace('_', ' ').toUpperCase()} agent is analyzing requirements...`,
        timestamp: new Date(),
        agentType: agent.type,
        status: 'sending',
        metadata: { type: 'agent-start', agentType: agent.type }
      };

      setMessages(prev => [...prev, startMessage]);
      setActiveAgents(prev => [...prev.filter(a => a !== agent.type), agent.type]);

      // Agent working
      const workingMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'agent',
        content: `🔄 ${agent.type.replace('_', ' ').toUpperCase()} is generating code...`,
        timestamp: new Date(),
        agentType: agent.type,
        status: 'sent',
        metadata: { type: 'agent-working', agentType: agent.type }
      };

      setMessages(prev => [...prev, workingMessage]);

      await new Promise(resolve => setTimeout(resolve, agent.duration));

      // Agent completes
      const completionMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'agent',
        content: `✅ ${agent.type.replace('_', ' ').toUpperCase()} completed successfully!`,
        timestamp: new Date(),
        agentType: agent.type,
        status: 'completed',
        metadata: { type: 'agent-completed', agentType: agent.type }
      };

      setMessages(prev => [...prev, completionMessage]);
      setActiveAgents(prev => prev.filter(a => a !== agent.type));
    }

    // Workflow completion
    const completionMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'agent',
      content: '🎉 Multi-agent workflow completed! Your application is ready for review and deployment.',
      timestamp: new Date(),
      status: 'completed',
      metadata: { type: 'workflow-completed', sessionId }
    };

    setMessages(prev => [...prev, completionMessage]);
    setIsTyping(false);
  };

  const formatAgentName = (agentType: AgentType): string => {
    return agentType.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  const getAgentIcon = (agentType: AgentType): string => {
    switch (agentType) {
      case AgentType.PLANNER: return '📋';
      case AgentType.FRONTEND_CODER: return '🎨';
      case AgentType.BACKEND_CODER: return '⚙️';
      case AgentType.DB_DESIGNER: return '🗄️';
      case AgentType.TESTER: return '🧪';
      case AgentType.SECURITY_REVIEWER: return '🔐';
      case AgentType.UI_DESIGNER: return '🎨';
      case AgentType.OPTIMIZER: return '⚡';
      case AgentType.DEBUGGER: return '🐛';
      default: return '🤖';
    }
  };

  const getAgentColor = (agentType: AgentType): string => {
    switch (agentType) {
      case AgentType.PLANNER: return 'text-purple-400';
      case AgentType.FRONTEND_CODER: return 'text-green-400';
      case AgentType.BACKEND_CODER: return 'text-orange-400';
      case AgentType.DB_DESIGNER: return 'text-cyan-400';
      case AgentType.TESTER: return 'text-red-400';
      case AgentType.SECURITY_REVIEWER: return 'text-pink-400';
      case AgentType.UI_DESIGNER: return 'text-pink-400';
      case AgentType.OPTIMIZER: return 'text-yellow-400';
      case AgentType.DEBUGGER: return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // Show feedback (could add toast notification here)
  };

  return (
    <div className={`flex flex-col h-full bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <span className="text-sm text-gray-400">
              Multi-Agent System
            </span>
          </div>
          {agentSessionId && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Session:</span>
              <span className="text-sm font-mono text-purple-400">
                {agentSessionId.slice(-8)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Active Agents Indicator */}
      {activeAgents.length > 0 && (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
            <span className="text-sm text-gray-300">
              Active Agents:
            </span>
            <div className="flex gap-1">
              {activeAgents.map(agentType => (
                <span
                  key={agentType}
                  className={`px-2 py-1 text-xs rounded ${getAgentColor(agentType)}`}
                >
                  {getAgentIcon(agentType)} {formatAgentName(agentType)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'agent' && (
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  message.status === 'completed'
                    ? 'bg-green-500'
                    : message.status === 'error'
                    ? 'bg-red-500'
                    : 'bg-gray-600'
                }`}>
                  {message.status === 'sending' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : message.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : message.status === 'error' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              {message.role === 'agent' && message.agentType && (
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className={`px-2 py-1 rounded ${getAgentColor(message.agentType)} bg-gray-700`}>
                    {getAgentIcon(message.agentType)} {formatAgentName(message.agentType)}
                  </span>
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap">
                {message.content}
              </div>
              {message.role === 'agent' && message.status === 'completed' && (
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <span>Completed at {message.timestamp.toLocaleTimeString()}</span>
                  <button
                    onClick={() => copyMessage(message.content)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                    title="Copy message"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(inputValue);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            disabled={isTyping}
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded-lg"
          >
            {isTyping ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}