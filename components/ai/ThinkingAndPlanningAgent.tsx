'use client';

import { useState, useEffect, useRef } from 'react';
import {
  CrystalBall,
  SpellBook,
  Candle,
  Sparkles,
  Hourglass,
  Brain,
  Lightbulb,
  CheckCircle,
  Circle,
  Timer,
  Star,
  Moon,
  Sun
} from 'lucide-react';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ANCIENT_WISDOM, MAGICAL_SYMBOLS } from '@/lib/ai/ancientWisdom';

interface MagicalTodo {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'thinking' | 'planning' | 'crafting' | 'enchanting' | 'completed';
  estimatedTime: number; // in minutes
  magicalEnergy: number; // 1-100
  dependencies: string[];
  spells: string[];
  wisdom?: string;
}

interface ThinkingAgentProps {
  projectId: string;
  onTodoUpdate: (todos: MagicalTodo[]) => void;
  className?: string;
}

export function ThinkingAndPlanningAgent({ projectId, onTodoUpdate, className = '' }: ThinkingAgentProps) {
  const [todos, setTodos] = useState<MagicalTodo[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentThought, setCurrentThought] = useState('');
  const [planningPhase, setPlanningPhase] = useState<'contemplation' | 'scrying' | 'oracle' | 'enchanting'>('contemplation');
  const [magicalEnergy, setMagicalEnergy] = useState(100);
  const [ancientGuidance, setAncientGuidance] = useState<string[]>([]);

  const thinkingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize with some magical todos
    const initialTodos: MagicalTodo[] = [
      {
        id: 'magic-001',
        title: 'Contemplate Project Vision',
        description: 'Scry into the digital ethereal to understand the true nature of the project',
        priority: 'critical',
        status: 'thinking',
        estimatedTime: 15,
        magicalEnergy: 25,
        dependencies: [],
        spells: ['scrying_vision', 'project_insight'],
        wisdom: ANCIENT_WISDOM.oracle.insights[Math.floor(Math.random() * ANCIENT_WISDOM.oracle.insights.length)]
      },
      {
        id: 'magic-002',
        title: 'Gather Magical Ingredients',
        description: 'Collect the digital herbs and crystals needed for the spellcraft',
        priority: 'high',
        status: 'planning',
        estimatedTime: 30,
        magicalEnergy: 40,
        dependencies: ['magic-001'],
        spells: ['ingredient_gathering', 'resource_scrying'],
        wisdom: ANCIENT_WISDOM.alchemist.recipes[Math.floor(Math.random() * ANCIENT_WISDOM.alchemist.recipes.length)]
      },
      {
        id: 'magic-003',
        title: 'Craft Initial Incantations',
        description: 'Write the foundational spells that will form the project structure',
        priority: 'high',
        status: 'crafting',
        estimatedTime: 45,
        magicalEnergy: 60,
        dependencies: ['magic-001', 'magic-002'],
        spells: ['code_enchanting', 'structure_weaving'],
        wisdom: ANCIENT_WISDOM.enchanter.spells[Math.floor(Math.random() * ANCIENT_WISDOM.enchanter.spells.length)]
      }
    ];

    setTodos(initialTodos);
    onTodoUpdate(initialTodos);
  }, [projectId, onTodoUpdate]);

  useEffect(() => {
    if (isThinking) {
      thinkingIntervalRef.current = setInterval(() => {
        setMagicalEnergy(prev => Math.max(0, prev - 1));
        generateThought();
      }, 3000);
    } else {
      if (thinkingIntervalRef.current) {
        clearInterval(thinkingIntervalRef.current);
      }
    }

    return () => {
      if (thinkingIntervalRef.current) {
        clearInterval(thinkingIntervalRef.current);
      }
    };
  }, [isThinking]);

  const generateThought = () => {
    const thoughts = [
      "The digital threads whisper of new possibilities...",
      "Ancient algorithms reveal their secrets to me...",
      "The code spirits are stirring with anticipation...",
      "I see the shape of the project in the crystal ball...",
      "The magical architecture is taking form in my mind...",
      "Binary spells dance at the edge of consciousness...",
      "The server spirits are awakening from their slumber...",
      "The database crystals are humming with energy..."
    ];

    const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
    setCurrentThought(randomThought);

    // Add ancient wisdom
    const wisdomSource = Math.random();
    let wisdom = '';

    if (wisdomSource < 0.25) {
      wisdom = ANCIENT_WISDOM.oracle.insights[Math.floor(Math.random() * ANCIENT_WISDOM.oracle.insights.length)];
    } else if (wisdomSource < 0.5) {
      wisdom = ANCIENT_WISDOM.scholar.wisdom[Math.floor(Math.random() * ANCIENT_WISDOM.scholar.wisdom.length)];
    } else if (wisdomSource < 0.75) {
      wisdom = ANCIENT_WISDOM.architect.principles[Math.floor(Math.random() * ANCIENT_WISDOM.architect.principles.length)];
    } else {
      wisdom = ANCIENT_WISDOM.mentor.teachings[Math.floor(Math.random() * ANCIENT_WISDOM.mentor.teachings.length)];
    }

    setAncientGuidance(prev => [...prev.slice(-2), wisdom]);
  };

  const updateTodoStatus = (todoId: string, newStatus: MagicalTodo['status']) => {
    setTodos(prev => {
      const updated = prev.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, status: newStatus };
        }
        return todo;
      });

      // Check if we can auto-complete dependent todos
      if (newStatus === 'completed') {
        return updated.map(todo => {
          if (todo.dependencies.includes(todoId) && todo.dependencies.every(dep =>
            updated.find(t => t.id === dep)?.status === 'completed'
          )) {
            return { ...todo, status: 'thinking' };
          }
          return todo;
        });
      }

      return updated;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 border-red-400';
      case 'high': return 'text-orange-400 border-orange-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'thinking': return <Brain className="h-4 w-4" />;
      case 'planning': return <Hourglass className="h-4 w-4" />;
      case 'crafting': return <Sparkles className="h-4 w-4" />;
      case 'enchanting': return <Star className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thinking': return 'text-purple-400 bg-purple-400/10';
      case 'planning': return 'text-blue-400 bg-blue-400/10';
      case 'crafting': return 'text-yellow-400 bg-yellow-400/10';
      case 'enchanting': return 'text-green-400 bg-green-400/10';
      case 'completed': return 'text-emerald-400 bg-emerald-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const addNewMagicalTodo = () => {
    const newTodo: MagicalTodo = {
      id: `magic-${Date.now()}`,
      title: 'New Magical Task',
      description: 'A task born from digital magic and ancient wisdom',
      priority: 'medium',
      status: 'thinking',
      estimatedTime: 30,
      magicalEnergy: 50,
      dependencies: [],
      spells: ['basic_enchantment'],
      wisdom: ANCIENT_WISDOM.scholar.wisdom[Math.floor(Math.random() * ANCIENT_WISDOM.scholar.wisdom.length)]
    };

    setTodos(prev => [...prev, newTodo]);
    onTodoUpdate([...todos, newTodo]);
  };

  const startThinkingProcess = () => {
    setIsThinking(true);
    setPlanningPhase('contemplation');

    // Cycle through planning phases
    const phases: Array<'contemplation' | 'scrying' | 'oracle' | 'enchanting'> = ['contemplation', 'scrying', 'oracle', 'enchanting'];
    let phaseIndex = 0;

    const phaseInterval = setInterval(() => {
      phaseIndex++;
      if (phaseIndex >= phases.length) {
        setIsThinking(false);
        clearInterval(phaseInterval);
        setPlanningPhase('contemplation');
      } else {
        setPlanningPhase(phases[phaseIndex]);
      }
    }, 10000);
  };

  return (
    <div className={`h-full bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <CrystalBall className="h-8 w-8 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Thinking & Planning Sanctum</h2>
                <p className="text-sm text-purple-300">Where magical ideas take form and ancient wisdom guides creation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-purple-300 mb-1">Magical Energy</div>
                <div className="flex items-center gap-2">
                  <Progress value={magicalEnergy} className="w-20 h-2 bg-purple-900/50" />
                  <span className="text-sm text-purple-300 font-mono">{magicalEnergy}%</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-purple-300 mb-1">Current Phase</div>
                <Badge variant="outline" className="text-purple-300 border-purple-400">
                  {planningPhase}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Ancient Wisdom Banner */}
        {ancientGuidance.length > 0 && (
          <div className="bg-gradient-to-r from-purple-800/30 to-indigo-800/30 border-b border-purple-500/20 p-4">
            <div className="flex items-center gap-3">
              <SpellBook className="h-5 w-5 text-purple-400" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-purple-300 mb-1">Ancient Wisdom Speaks:</div>
                <div className="text-xs text-purple-200 italic">
                  {ancientGuidance[ancientGuidance.length - 1]}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Thought */}
        {isThinking && currentThought && (
          <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-purple-400 animate-pulse" />
              <div className="flex-1">
                <div className="text-sm text-purple-200 animate-pulse">
                  {currentThought}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Magical Todo List */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Magical Task Grimoire</h3>
              <div className="flex gap-2">
                <WitchcraftButton
                  onClick={startThinkingProcess}
                  disabled={isThinking || magicalEnergy < 20}
                  spellType="illusion"
                  size="sm"
                >
                  {isThinking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Scrying...
                    </>
                  ) : (
                    <>
                      <CrystalBall className="h-4 w-4 mr-2" />
                      Begin Scrying
                    </>
                  )}
                </WitchcraftButton>
                <WitchcraftButton
                  onClick={addNewMagicalTodo}
                  spellType="enchantment"
                  size="sm"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Enchant Task
                </WitchcraftButton>
              </div>
            </div>

            {todos.map((todo, index) => (
              <Card key={todo.id} className="bg-black/40 backdrop-blur-sm border-purple-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30">
                        {getStatusIcon(todo.status)}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                          {todo.title}
                          <Badge variant="outline" className={getPriorityColor(todo.priority)}>
                            {todo.priority}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-purple-200">
                          {todo.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(todo.status)}>
                        {todo.status}
                      </Badge>
                      <div className="text-xs text-purple-300">
                        <Timer className="h-3 w-3 inline mr-1" />
                        {todo.estimatedTime}m
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Magical Energy */}
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-purple-300">Magical Energy:</span>
                      <Progress value={todo.magicalEnergy} className="flex-1 h-2 bg-purple-900/50" />
                      <span className="text-xs text-purple-300 font-mono">{todo.magicalEnergy}%</span>
                    </div>

                    {/* Spells */}
                    {todo.spells.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Spells:</span>
                        <div className="flex gap-1">
                          {todo.spells.map((spell, spellIndex) => (
                            <Badge key={spellIndex} variant="outline" className="text-xs text-purple-300 border-purple-400">
                              {spell.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ancient Wisdom */}
                    {todo.wisdom && (
                      <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Moon className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-semibold text-purple-300">Ancient Wisdom:</span>
                        </div>
                        <p className="text-xs text-purple-200 italic">
                          "{todo.wisdom}"
                        </p>
                      </div>
                    )}

                    {/* Dependencies */}
                    {todo.dependencies.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Candle className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Depends on:</span>
                        <div className="flex gap-1">
                          {todo.dependencies.map((dep, depIndex) => (
                            <Badge key={depIndex} variant="outline" className="text-xs text-blue-300 border-blue-400">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {todo.status === 'thinking' && (
                        <WitchcraftButton
                          onClick={() => updateTodoStatus(todo.id, 'planning')}
                          spellType="divination"
                          size="sm"
                        >
                          <Lightbulb className="h-3 w-3 mr-1" />
                          Begin Planning
                        </WitchcraftButton>
                      )}

                      {todo.status === 'planning' && (
                        <WitchcraftButton
                          onClick={() => updateTodoStatus(todo.id, 'crafting')}
                          spellType="transmutation"
                          size="sm"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Start Crafting
                        </WitchcraftButton>
                      )}

                      {todo.status === 'crafting' && (
                        <WitchcraftButton
                          onClick={() => updateTodoStatus(todo.id, 'enchanting')}
                          spellType="enchantment"
                          size="sm"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Enchant Code
                        </WitchcraftButton>
                      )}

                      {todo.status === 'enchanting' && (
                        <WitchcraftButton
                          onClick={() => updateTodoStatus(todo.id, 'completed')}
                          spellType="powerful"
                          size="sm"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete Spell
                        </WitchcraftButton>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Magical Controls */}
        <div className="bg-black/30 backdrop-blur-md border-t border-purple-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-purple-300">
                <Sun className="h-4 w-4 inline mr-1" />
                {todos.filter(t => t.status === 'completed').length} of {todos.length} tasks completed
              </div>
              <div className="text-sm text-purple-300">
                <Brain className="h-4 w-4 inline mr-1" />
                Current phase: {planningPhase}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <WitchcraftButton
                onClick={() => setMagicalEnergy(100)}
                spellType="protection"
                size="sm"
                disabled={magicalEnergy === 100}
              >
                Recharge Energy
              </WitchcraftButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}