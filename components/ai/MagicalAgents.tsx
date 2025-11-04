'use client';

import { useState, useEffect, useCallback } from 'react';
import { Brain, Sparkles, Wand2, Eye, Shield, Zap, Clock, Target } from 'lucide-react';

import { magicalAgentSystem, MagicalAgent, MagicalRole } from './MagicalAgents';
import { multiFrameworkCodeGenerator } from '@/lib/code/CodeGenerator';
import { ProjectConfigWizard } from '@/components/wizard/ProjectConfigWizard';

interface MagicalAgentSession {
  agentId: string;
  agentType: MagicalRole;
  personality: any;
  message: string;
  timestamp: Date;
  confidence: number;
  metadata: any;
}

interface MagicalAgentMessage {
  agentId: string;
  message: string;
  timestamp: Date;
  type: 'thinking' | 'analysis' | 'recommendation' | 'guidance' | 'warning';
  metadata?: any;
}

interface MagicalAgentInterfaceProps {
  projectConfig: any;
  onProjectGenerated: (result: any) => void;
  className?: string;
}

export function MagicalAgentInterface({ projectConfig, onProjectGenerated, className = '' }: MagicalAgentInterfaceProps) {
  const [sessions, setSessions] = useState<MagicalAgentSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentResponses, setAgentResponses] = useState<MagicalAgentMessage[]>([]);

  // Generate magical agent sessions
  useEffect(() => {
    if (projectConfig) {
      const agentSession = magicalAgentSystem.generateAgentSession(projectConfig);
      setSessions([agentSession]);
      setActiveSession(agentSession.agentId);

      // Welcome message from lead agent
      const welcomeMessage: MagicalText.create(
        `Greetings, young ${projectConfig.targetAudience || 'developer'}! I am ${
          magicalAgentSystem.getAgent(MagicalRole.ORACLE).personality.tone
        }. I will be your guide through the mystical journey of creating ${projectConfig.projectName}.

        Our ancient wisdom combined with modern AI suggests ${
          agentSession.confidence}% confidence in success. Let's begin with understanding your vision.
      `);

      setAgentResponses([{
        agentId: agentSession.agentId,
        message: welcomeMessage,
        timestamp: new Date(),
        type: 'thinking',
        metadata: {
          phase: 'greeting',
          confidence: agentSession.confidence
        }
      }]);
    }
  }, [projectConfig]);

  const handleUserMessage = useCallback((message: string) => {
    if (!activeSession || !isProcessing) return;

    setIsProcessing(true);
    const currentSession = sessions.find(s => s.agentId === activeSession);

    if (currentSession) {
      setAgentSessions(prev => [...prev, {
        agentId: currentSession.agentId,
        message,
        timestamp: new Date(),
        type: 'analysis',
        metadata: {
          userInput: message,
          phase: 'user-input',
          previousMessages: agentResponses.slice(-3)
        }
      }]);

      // Get response from AI agent
      setTimeout(async () => {
        try {
          const response = await magicalAgentSystem.castSpell(
            currentSession.agent,
            message,
            projectConfig
          );

          setAgentResponses(prev => [...prev, {
            agentId: currentSession.agentId,
            message: response.result.insight,
            timestamp: new Date(),
            type: 'guidance',
            metadata: {
              confidence: response.confidence,
              spellType: response.result.type,
              impact: response.result.impact,
              alternatives: response.result.alternatives
            }
          });

          setIsProcessing(false);
        } catch (error) {
          setAgentResponses(prev => [...prev, {
            agentId: currentSession.agentId,
            message: `I sense an error in the cosmic currents. Please clarify your requirements.`,
            timestamp: new Date(),
            type: 'warning',
            metadata: { error: error.message }
          }]);
          setIsProcessing(false);
        }
      }, 1500);
    }
  }, [activeSession, isProcessing, agentResponses]);

  const handleGenerate = useCallback(() => {
    if (!projectConfig) return;

    setIsProcessing(true);
    setStudioState(prev => ({ ...prev, isGenerating: true }));

    // Generate project using the magical agent system
    setTimeout(() => {
      multiFrameworkCodeGenerator.generateFullStackApplication({
        ...projectConfig,
        features: selectedFeatures
      }).then((result) => {
        setStudioState(prev => ({
          ...prev,
          isGenerating: false,
          generationProgress: 100,
          projectData: {
            ...prev.projectData,
            status: 'ready',
            techStack: {
              ...prev.projectData.techStack,
              ...result.packageJson
            }
          }
        }));

          onProjectGenerated(result);
        });
    }, 5000);
  }, [projectConfig, selectedFeatures, studioState.isGenerating]);

  const handleFeatureSelection = useCallback((features: string[]) => {
    setSelectedFeatures(features);
    }, []);

  const handleAnalysis = useCallback(() => {
    if (!projectConfig) return;

    const report = magicalAgentSystem.generateMagicalReport({
      projectData: studioState.projectData,
      features: selectedFeatures
    });

    setAgentResponses(prev => [...prev, {
      agentId: 'analysis',
      message: report,
      timestamp: new Date(),
      type: 'analysis',
      metadata: {
        phase: 'analysis',
        confidence: 95
      }
    });
  }, [studioState.projectData, selectedFeatures]);

  const getActiveAgent = () => {
      return activeSession ? magicalAgentSystem.getAgent(activeSession.agentId) : null;
    };

  const isReadyToGenerate = studioState.projectData?.status === 'ready' ||
                              aiRecommendation?.confidence > 80;

  return {
    sessions,
    activeSession,
    isProcessing,
    agentResponses,
    getActiveAgent,
    handleGenerate,
    handleFeatureSelection,
    handleAnalysis,
    isReadyToGenerate
  };
}

// Export the magical components
export { magicalAgentSystem, MAGICAL_AGENTS };
export { MagicalRole, MagicalAgent, MagicalText } from './MagicalAgents';
export { WitchcraftButton, SpellBookButton, CrystalBallButton } from './WitchcraftButton';
export type { MagicalAgent as T } from './MagicalAgents';

export { default MagicalAgentInterface } from './MagicalAgentInterface';