'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Code2,
  Sparkles,
  Wand2,
  Zap,
  BookOpen,
  FlaskConical,
  Shield,
  Scroll,
  Gem,
  Fire,
  Droplets,
  Wind,
  Mountain,
  Star,
  CheckCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ANCIENT_WISDOM, MAGICAL_COLORS } from '@/lib/ai/ancientWisdom';

interface EnchantedSpell {
  id: string;
  name: string;
  type: 'transmutation' | 'enchantment' | 'illusion' | 'protection' | 'divination';
  description: string;
  power: number; // 1-100
  castingTime: number; // in seconds
  manaCost: number; // 1-100
  ingredients: string[];
  incantation: string;
  effects: string[];
  codeTemplate?: string;
  elementalAffinity: 'fire' | 'water' | 'earth' | 'air' | 'aether';
}

interface CodeGenerationTask {
  id: string;
  title: string;
  description: string;
  status: 'contemplating' | 'chanting' | 'weaving' | 'enchanting' | 'manifesting' | 'completed';
  assignedAgent: string;
  requiredSpells: string[];
  magicalEnergy: number;
  progress: number;
  codeGenerated?: string;
}

interface EnchantedCodeAgent {
  id: string;
  name: string;
  title: string;
  specialty: string;
  powerLevel: number;
  elementalMastery: string[];
  knownSpells: string[];
  currentTask?: CodeGenerationTask;
  isCasting: boolean;
  magicalAura: string;
}

interface EnchantedCodeAgentsProps {
  projectId: string;
  onCodeGenerated: (code: string, agent: string) => void;
  className?: string;
}

export function EnchantedCodeAgents({ projectId, onCodeGenerated, className = '' }: EnchantedCodeAgentsProps) {
  const [agents, setAgents] = useState<EnchantedCodeAgent[]>([]);
  const [spells, setSpells] = useState<EnchantedSpell[]>([]);
  const [tasks, setTasks] = useState<CodeGenerationTask[]>([]);
  const [isRitualActive, setIsRitualActive] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [ritualProgress, setRitualProgress] = useState(0);
  const [magicalAtmosphere, setMagicalAtmosphere] = useState(100);

  const ritualIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeMagicalSystem();
  }, [projectId]);

  useEffect(() => {
    if (isRitualActive) {
      ritualIntervalRef.current = setInterval(() => {
        setRitualProgress(prev => {
          if (prev >= 100) {
            setIsRitualActive(false);
            completeRitual();
            return 0;
          }
          return prev + 5;
        });
        setMagicalAtmosphere(prev => Math.max(0, prev - 2));
      }, 500);
    } else {
      if (ritualIntervalRef.current) {
        clearInterval(ritualIntervalRef.current);
      }
    }

    return () => {
      if (ritualIntervalRef.current) {
        clearInterval(ritualIntervalRef.current);
      }
    };
  }, [isRitualActive]);

  const initializeMagicalSystem = () => {
    // Initialize Enchanted Code Agents
    const enchantedAgents: EnchantedCodeAgent[] = [
      {
        id: 'enchanter-001',
        name: 'Zephyr Code Weaver',
        title: 'Master of Transmutation Spells',
        specialty: 'Frontend Enchantments',
        powerLevel: 95,
        elementalMastery: ['air', 'aether'],
        knownSpells: ['react_transmutation', 'css_enchantment', 'component_weaving'],
        isCasting: false,
        magicalAura: 'purple'
      },
      {
        id: 'alchemist-001',
        name: 'Mercury Server Smith',
        title: 'Architect of Backend Alchemy',
        specialty: 'Server-side Transformations',
        powerLevel: 92,
        elementalMastery: ['fire', 'earth'],
        knownSpells: ['api_alchemy', 'database_transmutation', 'server_enchantment'],
        isCasting: false,
        magicalAura: 'orange'
      },
      {
        id: 'oracle-001',
        name: 'Luna Database Seer',
        title: 'Oracle of Data Divination',
        specialty: 'Database Mysteries',
        powerLevel: 88,
        elementalMastery: ['water', 'aether'],
        knownSpells: ['schema_divination', 'query_enchantment', 'data_protection'],
        isCasting: false,
        magicalAura: 'blue'
      },
      {
        id: 'protector-001',
        name: 'Aegis Security Ward',
        title: 'Guardian of Protection Spells',
        specialty: 'Security Enchantments',
        powerLevel: 94,
        elementalMastery: ['earth', 'fire'],
        knownSpells: ['security_ward', 'authentication_enchantment', 'protection_barrier'],
        isCasting: false,
        magicalAura: 'green'
      }
    ];

    // Initialize Enchanted Spells
    const enchantedSpells: EnchantedSpell[] = [
      {
        id: 'react_transmutation',
        name: 'React Transmutation',
        type: 'transmutation',
        description: 'Transform ideas into living React components',
        power: 85,
        castingTime: 30,
        manaCost: 40,
        ingredients: ['TypeScript crystals', 'State management essence', 'Component blueprint'],
        incantation: 'Ex Componentia, Reactivus Maximus!',
        effects: ['Creates reusable components', 'Manages state magically', 'Optimizes rendering'],
        elementalAffinity: 'air',
        codeTemplate: `
// React Component created through transmutation
interface ${'{{componentName}}'}Props {
  // Properties appear as if by magic
}

export const ${'{{componentName}}'}: React.FC<${'{{componentName}}'}Props> = (props) => {
  // Component logic manifests here
  return (
    <div className="magical-component">
      {/* UI appears through enchantment */}
    </div>
  );
};
        `
      },
      {
        id: 'api_alchemy',
        name: 'API Alchemy',
        type: 'transmutation',
        description: 'Transform requirements into powerful API endpoints',
        power: 90,
        castingTime: 45,
        manaCost: 60,
        ingredients: ['Express framework', 'Middleware essence', 'Validation runes'],
        incantation: 'API Endopointus, Respondus Maximus!',
        effects: ['Creates RESTful endpoints', 'Handles requests magically', 'Validates input automatically'],
        elementalAffinity: 'fire',
        codeTemplate: `
// API endpoint created through alchemy
app.${'{{method}}'}('${'{{endpoint}}}', async (req, res) => {
  try {
    // Request processing through magical means
    const result = await processRequest(req.body);

    // Response manifests as if by magic
    res.json({
      success: true,
      data: result,
      message: 'Spell cast successfully!'
    });
  } catch (error) {
    // Error handling through protective wards
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
        `
      },
      {
        id: 'database_transmutation',
        name: 'Database Transmutation',
        type: 'enchantment',
        description: 'Enchant databases with magical schemas and queries',
        power: 80,
        castingTime: 40,
        manaCost: 50,
        ingredients: ['SQL crystals', 'Schema blueprint', 'Index essence'],
        incantation: 'Data Structurus, Query Optimus!',
        effects: ['Optimizes queries', 'Creates efficient schemas', 'Ensures data integrity'],
        elementalAffinity: 'earth',
        codeTemplate: `
// Database model created through magical transmutation
model ${'{{modelName}}'} {
  id        String   @id @default(cuid())
  // Fields appear through magical manifestation
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships form as if by magic
  @@map('${'{{tableName}}'}')
}
        `
      },
      {
        id: 'security_ward',
        name: 'Security Ward',
        type: 'protection',
        description: 'Cast protective spells around your application',
        power: 95,
        castingTime: 35,
        manaCost: 45,
        ingredients: ['Authentication runes', 'Encryption crystals', 'Validation essence'],
        incantation: 'Protección Maximus, Security Fortis!',
        effects: ['Protects against attacks', 'Validates all input', 'Encrypts sensitive data'],
        elementalAffinity: 'fire',
        codeTemplate: `
// Security ward cast through ancient magic
export const ${'{{wardName}}'} = async (req, res, next) => {
  try {
    // Authentication check through magical means
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token || !(await validateToken(token))) {
      return res.status(401).json({
        error: 'Authentication ward blocks this path!'
      });
    }

    // Protection spell passed
    req.user = await decodeToken(token);
    next();
  } catch (error) {
    res.status(500).json({
      error: 'Protective ward malfunction!'
    });
  }
};
        `
      }
    ];

    setAgents(enchantedAgents);
    setSpells(enchantedSpells);

    // Create initial code generation tasks
    const initialTasks: CodeGenerationTask[] = [
      {
        id: 'task-001',
        title: 'Create Magical Component Structure',
        description: 'Weave the foundational components using React transmutation',
        status: 'contemplating',
        assignedAgent: 'enchanter-001',
        requiredSpells: ['react_transmutation'],
        magicalEnergy: 75,
        progress: 0
      },
      {
        id: 'task-002',
        title: 'Cast API Endpoints',
        description: 'Transform business logic into powerful API endpoints',
        status: 'contemplating',
        assignedAgent: 'alchemist-001',
        requiredSpells: ['api_alchemy'],
        magicalEnergy: 80,
        progress: 0
      },
      {
        id: 'task-003',
        title: 'Enchant Database Schema',
        description: 'Create magical database models and relationships',
        status: 'contemplating',
        assignedAgent: 'oracle-001',
        requiredSpells: ['database_transmutation'],
        magicalEnergy: 70,
        progress: 0
      },
      {
        id: 'task-004',
        title: 'Cast Security Wards',
        description: 'Protect the application with magical security spells',
        status: 'contemplating',
        assignedAgent: 'protector-001',
        requiredSpells: ['security_ward'],
        magicalEnergy: 85,
        progress: 0
      }
    ];

    setTasks(initialTasks);
  };

  const startMagicalRitual = () => {
    setIsRitualActive(true);
    setRitualProgress(0);

    // Assign tasks to agents and begin casting
    setTasks(prev => prev.map(task => ({
      ...task,
      status: 'chanting'
    })));

    setAgents(prev => prev.map(agent => {
      const assignedTask = tasks.find(task => task.assignedAgent === agent.id);
      return {
        ...agent,
        currentTask: assignedTask,
        isCasting: !!assignedTask
      };
    }));
  };

  const completeRitual = () => {
    // Generate magical code for each completed task
    const generatedCode = tasks.map(task => {
      const spell = spells.find(s => s.id === task.requiredSpells[0]);
      return {
        taskId: task.id,
        agent: task.assignedAgent,
        code: spell?.codeTemplate || '// Magical code generated through ancient spells',
        title: task.title
      };
    });

    // Notify parent of generated code
    generatedCode.forEach(gen => {
      if (gen.code) {
        onCodeGenerated(gen.code, gen.agent);
      }
    });

    // Update task statuses
    setTasks(prev => prev.map(task => ({
      ...task,
      status: 'completed',
      progress: 100,
      codeGenerated: spells.find(s => s.id === task.requiredSpells[0])?.codeTemplate
    })));

    // Reset agents
    setAgents(prev => prev.map(agent => ({
      ...agent,
      isCasting: false,
      currentTask: undefined
    })));

    // Recharge magical atmosphere
    setMagicalAtmosphere(100);
  };

  const getElementalIcon = (element: string) => {
    switch (element) {
      case 'fire': return <Fire className="h-4 w-4" />;
      case 'water': return <Droplets className="h-4 w-4" />;
      case 'earth': return <Mountain className="h-4 w-4" />;
      case 'air': return <Wind className="h-4 w-4" />;
      case 'aether': return <Star className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'contemplating': return 'text-purple-400 bg-purple-400/10';
      case 'chanting': return 'text-blue-400 bg-blue-400/10';
      case 'weaving': return 'text-yellow-400 bg-yellow-400/10';
      case 'enchanting': return 'text-green-400 bg-green-400/10';
      case 'manifesting': return 'text-orange-400 bg-orange-400/10';
      case 'completed': return 'text-emerald-400 bg-emerald-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getSpellTypeColor = (type: string) => {
    switch (type) {
      case 'transmutation': return 'text-orange-400 border-orange-400';
      case 'enchantment': return 'text-purple-400 border-purple-400';
      case 'illusion': return 'text-blue-400 border-blue-400';
      case 'protection': return 'text-green-400 border-green-400';
      case 'divination': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const assignTaskToAgent = (taskId: string, agentId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, assignedAgent: agentId }
        : task
    ));

    setAgents(prev => prev.map(agent => ({
      ...agent,
      currentTask: agent.id === agentId ? tasks.find(t => t.id === taskId) : agent.currentTask
    })));
  };

  return (
    <div className={`h-full bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Wand2 className="h-8 w-8 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Enchanted Code Agents</h2>
                <p className="text-sm text-purple-300">Where magical spells become functional code</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-purple-300 mb-1">Magical Atmosphere</div>
                <Progress value={magicalAtmosphere} className="w-20 h-2 bg-purple-900/50" />
              </div>
              <div className="text-center">
                <div className="text-xs text-purple-300 mb-1">Ritual Progress</div>
                <Progress value={ritualProgress} className="w-20 h-2 bg-purple-900/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Magical Agents Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {agents.map(agent => (
              <Card
                key={agent.id}
                className={`bg-black/40 backdrop-blur-sm border-2 cursor-pointer transition-all ${
                  selectedAgent === agent.id
                    ? 'border-purple-400 shadow-lg shadow-purple-400/20'
                    : 'border-purple-500/20 hover:border-purple-400/50'
                } ${agent.isCasting ? 'animate-pulse' : ''}`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full bg-${agent.magicalAura}-500/20 flex items-center justify-center`}>
                        <Code2 className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-sm text-white">{agent.name}</CardTitle>
                        <CardDescription className="text-xs text-purple-300">
                          {agent.title}
                        </CardDescription>
                      </div>
                    </div>
                    {agent.isCasting && (
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs text-purple-300 border-purple-400">
                        {agent.specialty}
                      </Badge>
                      <div className="text-xs text-purple-300">
                        Power: {agent.powerLevel}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {agent.elementalMastery.map((element, index) => (
                        <div key={index} className="flex items-center gap-1 text-xs text-purple-300">
                          {getElementalIcon(element)}
                        </div>
                      ))}
                    </div>
                    {agent.currentTask && (
                      <div className="bg-purple-800/20 border border-purple-500/20 rounded p-2">
                        <div className="text-xs text-purple-200 font-semibold truncate">
                          {agent.currentTask.title}
                        </div>
                        <Progress value={agent.currentTask.progress} className="h-1 mt-1" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Code Generation Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Magical Code Generation Tasks</h3>
              <div className="flex gap-2">
                <WitchcraftButton
                  onClick={startMagicalRitual}
                  disabled={isRitualActive || magicalAtmosphere < 50}
                  spellType="enchantment"
                  size="sm"
                >
                  {isRitualActive ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Ritual in Progress
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Begin Magical Ritual
                    </>
                  )}
                </WitchcraftButton>
              </div>
            </div>

            {tasks.map(task => {
              const assignedAgent = agents.find(a => a.id === task.assignedAgent);
              const requiredSpell = spells.find(s => s.id === task.requiredSpells[0]);

              return (
                <Card key={task.id} className="bg-black/40 backdrop-blur-sm border-purple-500/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/30">
                          <Sparkles className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-white">{task.title}</CardTitle>
                          <CardDescription className="text-purple-200">
                            {task.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        {assignedAgent && (
                          <Badge variant="outline" className="text-xs text-purple-300 border-purple-400">
                            {assignedAgent.name.split(' ')[0]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Progress */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-purple-300">Progress:</span>
                        <Progress value={task.progress} className="flex-1 h-2 bg-purple-900/50" />
                        <span className="text-xs text-purple-300 font-mono">{task.progress}%</span>
                      </div>

                      {/* Required Spell */}
                      {requiredSpell && (
                        <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <FlaskConical className="h-4 w-4 text-purple-400" />
                              <span className="text-sm font-semibold text-purple-300">
                                Required Spell: {requiredSpell.name}
                              </span>
                            </div>
                            <Badge variant="outline" className={getSpellTypeColor(requiredSpell.type)}>
                              {requiredSpell.type}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-purple-300">
                              {getElementalIcon(requiredSpell.elementalAffinity)}
                              <span>Power: {requiredSpell.power}</span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-purple-200 italic">
                            "{requiredSpell.incantation}"
                          </div>
                          <div className="mt-2 text-xs text-purple-300">
                            <strong>Effects:</strong> {requiredSpell.effects.join(', ')}
                          </div>
                        </div>
                      )}

                      {/* Magical Energy */}
                      <div className="flex items-center gap-2">
                        <Gem className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Magical Energy Required:</span>
                        <div className="flex-1 max-w-xs">
                          <Progress value={task.magicalEnergy} className="h-2 bg-purple-900/50" />
                        </div>
                        <span className="text-xs text-purple-300 font-mono">{task.magicalEnergy}%</span>
                      </div>

                      {/* Generated Code Preview */}
                      {task.codeGenerated && (
                        <div className="bg-black/60 border border-purple-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Scroll className="h-4 w-4 text-purple-400" />
                            <span className="text-sm font-semibold text-purple-300">Generated Magical Code:</span>
                          </div>
                          <pre className="text-xs text-purple-200 font-mono bg-purple-900/20 p-2 rounded overflow-x-auto">
                            {task.codeGenerated.substring(0, 200)}...
                          </pre>
                        </div>
                      )}

                      {/* Agent Assignment */}
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Assigned Agent:</span>
                        <select
                          value={task.assignedAgent}
                          onChange={(e) => assignTaskToAgent(task.id, e.target.value)}
                          className="bg-purple-900/50 border border-purple-500/20 rounded px-2 py-1 text-sm text-purple-200"
                          disabled={isRitualActive}
                        >
                          {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}