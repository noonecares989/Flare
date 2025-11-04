'use client';

import { useState, useEffect } from 'react';
import {
  Gem,
  Coins,
  Crown,
  Sparkles,
  TrendingUp,
  ShoppingCart,
  Package,
  Zap,
  Star,
  Trophy,
  Gift,
  Shield,
  Heart,
  Flame,
  Droplet,
  Wind,
  Mountain,
  Eye
} from 'lucide-react';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

// Crystal Economy System
export interface CrystalType {
  id: string;
  name: string;
  color: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  value: number; // in magical coins
  description: string;
  elementalAffinity: 'fire' | 'water' | 'earth' | 'air' | 'aether' | 'chaos' | 'order';
  magicalProperties: string[];
}

export interface MagicalCurrency {
  type: 'coins' | 'gems' | 'essence';
  amount: number;
  lastUpdated: Date;
}

export interface CrystalTransaction {
  id: string;
  type: 'earn' | 'spend' | 'trade' | 'gift' | 'reward';
  amount: number;
  crystalType: string;
  description: string;
  timestamp: Date;
  fromUser?: string;
  toUser?: string;
}

export interface MagicalItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'gems' | 'essence';
  category: 'spells' | 'artifacts' | 'potions' | 'scrolls' | 'runes' | 'enchants';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  benefits: string[];
  requiredLevel?: number;
  isLimited?: boolean;
  stock?: number;
}

export interface UserEconomyProfile {
  userId: string;
  username: string;
  level: number;
  experience: number;
  currency: {
    coins: MagicalCurrency;
    gems: MagicalCurrency;
    essence: MagicalCurrency;
  };
  crystalInventory: Record<string, number>;
  ownedItems: string[];
  achievements: string[];
  dailyRewards: {
    lastClaim: Date;
    streak: number;
  };
}

interface CrystalEconomyProps {
  userId: string;
  username: string;
  onPurchase: (item: MagicalItem) => void;
  className?: string;
}

export function CrystalEconomy({ userId, username, onPurchase, className = '' }: CrystalEconomyProps) {
  const [userProfile, setUserProfile] = useState<UserEconomyProfile | null>(null);
  const [crystalTypes, setCrystalTypes] = useState<CrystalType[]>([]);
  const [availableItems, setAvailableItems] = useState<MagicalItem[]>([]);
  const [transactions, setTransactions] = useState<CrystalTransaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAnimatingPurchase, setIsAnimatingPurchase] = useState<string | null>(null);

  useEffect(() => {
    initializeCrystalEconomy();
  }, [userId]);

  const initializeCrystalEconomy = () => {
    // Initialize crystal types
    const crystals: CrystalType[] = [
      {
        id: 'quartz',
        name: 'Clear Quartz',
        color: '#ffffff',
        rarity: 'common',
        value: 10,
        description: 'A basic crystal for minor magical enhancements',
        elementalAffinity: 'aether',
        magicalProperties: ['Clarity', 'Focus', 'Basic energy']
      },
      {
        id: 'amethyst',
        name: 'Amethyst',
        color: '#9b59b6',
        rarity: 'uncommon',
        value: 25,
        description: 'A purple crystal with spiritual properties',
        elementalAffinity: 'aether',
        magicalProperties: ['Wisdom', 'Intuition', 'Psychic abilities']
      },
      {
        id: 'ruby',
        name: 'Ruby',
        color: '#e74c3c',
        rarity: 'rare',
        value: 75,
        description: 'A fiery crystal of passion and power',
        elementalAffinity: 'fire',
        magicalProperties: ['Courage', 'Vitality', 'Strength']
      },
      {
        id: 'sapphire',
        name: 'Sapphire',
        color: '#3498db',
        rarity: 'rare',
        value: 80,
        description: 'A blue crystal of knowledge and truth',
        elementalAffinity: 'water',
        magicalProperties: ['Wisdom', 'Calm', 'Focus']
      },
      {
        id: 'emerald',
        name: 'Emerald',
        color: '#2ecc71',
        rarity: 'epic',
        value: 150,
        description: 'A green crystal of growth and abundance',
        elementalAffinity: 'earth',
        magicalProperties: ['Growth', 'Prosperity', 'Healing']
      },
      {
        id: 'diamond',
        name: 'Diamond',
        color: '#bdc3c7',
        rarity: 'legendary',
        value: 500,
        description: 'The ultimate crystal of pure magical energy',
        elementalAffinity: 'aether',
        magicalProperties: ['Purity', 'Amplification', 'Mastery']
      },
      {
        id: 'obsidian',
        name: 'Obsidian',
        color: '#2c3e50',
        rarity: 'uncommon',
        value: 30,
        description: 'A protective stone that absorbs negative energy',
        elementalAffinity: 'earth',
        magicalProperties: ['Protection', 'Grounding', 'Absorption']
      },
      {
        id: 'moonstone',
        name: 'Moonstone',
        color: '#ecf0f1',
        rarity: 'rare',
        value: 60,
        description: 'A mystical stone connected to lunar cycles',
        elementalAffinity: 'water',
        magicalProperties: ['Intuition', 'Cycles', 'Feminine energy']
      }
    ];

    // Initialize magical items
    const items: MagicalItem[] = [
      // Spells
      {
        id: 'speed_enchantment',
        name: 'Speed Enchantment Spell',
        description: 'Cast a spell that increases development speed by 50%',
        price: 500,
        currency: 'coins',
        category: 'spells',
        rarity: 'uncommon',
        benefits: ['50% faster coding', 'Reduced compile time', 'Enhanced productivity'],
        requiredLevel: 5
      },
      {
        id: 'debugging_orb',
        name: 'Debugging Orb',
        description: 'A magical orb that highlights bugs in your code',
        price: 800,
        currency: 'coins',
        category: 'artifacts',
        rarity: 'rare',
        benefits: ['Auto-detect bugs', 'Suggest fixes', 'Prevent future errors'],
        requiredLevel: 10
      },
      {
        id: 'productivity_potion',
        name: 'Productivity Potion',
        description: 'Drink this potion to double your focus for 2 hours',
        price: 200,
        currency: 'gems',
        category: 'potions',
        rarity: 'common',
        benefits: ['2x focus', 'Time distortion', 'Mental clarity'],
        isLimited: true,
        stock: 10
      },
      {
        id: 'ancient_scroll',
        name: 'Ancient Scroll of Wisdom',
        description: 'Contains forgotten coding techniques from the ancients',
        price: 1500,
        currency: 'gems',
        category: 'scrolls',
        rarity: 'epic',
        benefits: ['Ancient algorithms', 'Optimized patterns', 'Secret techniques'],
        requiredLevel: 15
      },
      {
        id: 'power_rune',
        name: 'Power Rune',
        description: 'A rune that amplifies magical energy in all spells',
        price: 300,
        currency: 'essence',
        category: 'runes',
        rarity: 'rare',
        benefits: ['2x spell power', 'Reduced mana cost', 'Enhanced effects']
      },
      {
        id: 'ultimate_enchant',
        name: 'Ultimate Code Enchantment',
        description: 'The most powerful enchantment for perfect code',
        price: 5000,
        currency: 'gems',
        category: 'enchants',
        rarity: 'legendary',
        benefits: ['Perfect code generation', 'Zero bugs', 'Instant optimization', 'Auto-documentation'],
        requiredLevel: 25
      },
      {
        id: 'crystal_pack_basic',
        name: 'Basic Crystal Pack',
        description: 'A collection of 10 random common crystals',
        price: 100,
        currency: 'coins',
        category: 'artifacts',
        rarity: 'common',
        benefits: ['10 random crystals', 'Chance for rare crystal', 'Daily bonus']
      },
      {
        id: 'crystal_pack_premium',
        name: 'Premium Crystal Pack',
        description: 'A collection of 5 crystals with guaranteed rare',
        price: 500,
        currency: 'gems',
        category: 'artifacts',
        rarity: 'rare',
        benefits: ['5 quality crystals', 'Guaranteed rare', 'Chance for epic']
      }
    ];

    // Initialize user profile
    const profile: UserEconomyProfile = {
      userId,
      username,
      level: 12,
      experience: 3450,
      currency: {
        coins: { type: 'coins', amount: 2500, lastUpdated: new Date() },
        gems: { type: 'gems', amount: 85, lastUpdated: new Date() },
        essence: { type: 'essence', amount: 42, lastUpdated: new Date() }
      },
      crystalInventory: {
        quartz: 15,
        amethyst: 8,
        ruby: 3,
        sapphire: 2,
        emerald: 1,
        obsidian: 5,
        moonstone: 2
      },
      ownedItems: ['speed_enchantment', 'basic_crystal_pack'],
      achievements: ['first_crystal', 'speed_demon', 'bug_hunter'],
      dailyRewards: {
        lastClaim: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        streak: 7
      }
    };

    // Initialize transactions
    const mockTransactions: CrystalTransaction[] = [
      {
        id: '1',
        type: 'earn',
        amount: 100,
        crystalType: 'coins',
        description: 'Completed React Component spell',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        type: 'spend',
        amount: 500,
        crystalType: 'coins',
        description: 'Purchased Speed Enchantment Spell',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: '3',
        type: 'reward',
        amount: 50,
        crystalType: 'gems',
        description: 'Daily login reward',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];

    setCrystalTypes(crystals);
    setAvailableItems(items);
    setUserProfile(profile);
    setTransactions(mockTransactions);
  };

  const handlePurchase = (item: MagicalItem) => {
    if (!userProfile) return;

    const currency = userProfile.currency[item.currency];
    if (currency.amount < item.price) {
      alert('Insufficient magical currency!');
      return;
    }

    if (item.requiredLevel && userProfile.level < item.requiredLevel) {
      alert(`You need to be level ${item.requiredLevel} to purchase this item!`);
      return;
    }

    // Animate purchase
    setIsAnimatingPurchase(item.id);

    // Update user currency
    const updatedProfile = { ...userProfile };
    updatedProfile.currency[item.currency].amount -= item.price;
    updatedProfile.ownedItems.push(item.id);

    // Add transaction
    const newTransaction: CrystalTransaction = {
      id: Date.now().toString(),
      type: 'spend',
      amount: item.price,
      crystalType: item.currency,
      description: `Purchased ${item.name}`,
      timestamp: new Date()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setUserProfile(updatedProfile);

    // Call parent callback
    onPurchase(item);

    // Stop animation after delay
    setTimeout(() => {
      setIsAnimatingPurchase(null);
    }, 2000);
  };

  const claimDailyReward = () => {
    if (!userProfile) return;

    const now = new Date();
    const lastClaim = userProfile.dailyRewards.lastClaim;
    const daysSinceLastClaim = Math.floor((now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastClaim < 1) {
      alert('You have already claimed your daily reward!');
      return;
    }

    // Reset streak if more than 2 days missed
    const streakReset = daysSinceLastClaim > 2;
    const newStreak = streakReset ? 1 : userProfile.dailyRewards.streak + 1;

    // Calculate reward based on streak
    const baseReward = 100;
    const streakBonus = newStreak * 10;
    const totalCoins = baseReward + streakBonus;
    const gemsEarned = newStreak >= 7 ? 10 : 5;
    const essenceEarned = newStreak >= 30 ? 5 : 2;

    // Update profile
    const updatedProfile = { ...userProfile };
    updatedProfile.currency.coins.amount += totalCoins;
    updatedProfile.currency.gems.amount += gemsEarned;
    updatedProfile.currency.essence.amount += essenceEarned;
    updatedProfile.dailyRewards.lastClaim = now;
    updatedProfile.dailyRewards.streak = newStreak;

    // Add transactions
    const newTransactions: CrystalTransaction[] = [
      {
        id: Date.now().toString(),
        type: 'reward',
        amount: totalCoins,
        crystalType: 'coins',
        description: `Daily reward (Streak: ${newStreak})`,
        timestamp: now
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'reward',
        amount: gemsEarned,
        crystalType: 'gems',
        description: `Daily gems (Streak: ${newStreak})`,
        timestamp: now
      },
      {
        id: (Date.now() + 2).toString(),
        type: 'reward',
        amount: essenceEarned,
        crystalType: 'essence',
        description: `Daily essence (Streak: ${newStreak})`,
        timestamp: now
      }
    ];

    setTransactions(prev => [...newTransactions, ...prev]);
    setUserProfile(updatedProfile);

    alert(`Daily reward claimed! ${totalCoins} coins, ${gemsEarned} gems, ${essenceEarned} essence`);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'uncommon': return 'text-green-400 border-green-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spells': return <Sparkles className="h-4 w-4" />;
      case 'artifacts': return <Gem className="h-4 w-4" />;
      case 'potions': return <Flame className="h-4 w-4" />;
      case 'scrolls': return <Package className="h-4 w-4" />;
      case 'runes': return <Shield className="h-4 w-4" />;
      case 'enchants': return <Star className="h-4 w-4" />;
      default: return <Gem className="h-4 w-4" />;
    }
  };

  const getElementalIcon = (element: string) => {
    switch (element) {
      case 'fire': return <Flame className="h-4 w-4 text-orange-400" />;
      case 'water': return <Droplet className="h-4 w-4 text-blue-400" />;
      case 'earth': return <Mountain className="h-4 w-4 text-green-400" />;
      case 'air': return <Wind className="h-4 w-4 text-gray-400" />;
      case 'aether': return <Eye className="h-4 w-4 text-purple-400" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? availableItems
    : availableItems.filter(item => item.category === selectedCategory);

  if (!userProfile) {
    return (
      <div className={`h-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-white">Loading crystal economy...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Crown className="h-8 w-8 text-yellow-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Crystal Economy</h2>
                <p className="text-sm text-purple-300">Magical marketplace for enchanted artifacts</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {/* Currency Display */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-yellow-400" />
                    <span className="text-lg font-bold text-yellow-400">
                      {userProfile.currency.coins.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-purple-300">Coins</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <Gem className="h-5 w-5 text-purple-400" />
                    <span className="text-lg font-bold text-purple-400">
                      {userProfile.currency.gems.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-purple-300">Gems</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                    <span className="text-lg font-bold text-blue-400">
                      {userProfile.currency.essence.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-purple-300">Essence</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">Lv. {userProfile.level}</div>
                <div className="text-xs text-purple-300">Wizard</div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Rewards */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-purple-400" />
              <div>
                <div className="text-sm font-semibold text-white">Daily Reward</div>
                <div className="text-xs text-purple-300">
                  Current streak: {userProfile.dailyRewards.streak} days 🔥
                </div>
              </div>
            </div>
            <WitchcraftButton
              onClick={claimDailyReward}
              spellType="enchantment"
              size="sm"
              disabled={
                new Date().getTime() - userProfile.dailyRewards.lastClaim.getTime() < 24 * 60 * 60 * 1000
              }
            >
              Claim Daily
            </WitchcraftButton>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Category Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/30'
                }`}
              >
                All Items
              </button>
              {['spells', 'artifacts', 'potions', 'scrolls', 'runes', 'enchants'].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/30'
                  }`}
                >
                  {getCategoryIcon(category)}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {filteredItems.map(item => {
                const canAfford = userProfile.currency[item.currency].amount >= item.price;
                const meetsLevel = !item.requiredLevel || userProfile.level >= item.requiredLevel;
                const isOwned = userProfile.ownedItems.includes(item.id);

                return (
                  <Card
                    key={item.id}
                    className={`bg-black/40 backdrop-blur-sm border-purple-500/20 transition-all ${
                      isAnimatingPurchase === item.id ? 'animate-pulse scale-105' : ''
                    } ${isOwned ? 'opacity-50' : ''} ${
                      canAfford && meetsLevel && !isOwned ? 'hover:border-purple-400' : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600/20">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-sm text-white line-clamp-2">
                              {item.name}
                            </CardTitle>
                            <Badge variant="outline" className={getRarityColor(item.rarity)}>
                              {item.rarity}
                            </Badge>
                          </div>
                        </div>
                        {item.isLimited && item.stock && (
                          <Badge variant="outline" className="text-red-400 border-red-400">
                            {item.stock} left
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <CardDescription className="text-xs text-purple-200 line-clamp-2">
                          {item.description}
                        </CardDescription>

                        {/* Benefits */}
                        <div className="space-y-1">
                          {item.benefits.slice(0, 2).map((benefit, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-purple-400" />
                              <span className="text-xs text-purple-300">{benefit}</span>
                            </div>
                          ))}
                        </div>

                        {/* Requirements */}
                        {item.requiredLevel && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-purple-300">Level:</span>
                            <Badge variant="outline" className="text-xs">
                              {item.requiredLevel}
                            </Badge>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
                          <div className="flex items-center gap-2">
                            {item.currency === 'coins' && <Coins className="h-4 w-4 text-yellow-400" />}
                            {item.currency === 'gems' && <Gem className="h-4 w-4 text-purple-400" />}
                            {item.currency === 'essence' && <Sparkles className="h-4 w-4 text-blue-400" />}
                            <span className={`font-bold ${
                              item.currency === 'coins' ? 'text-yellow-400' :
                              item.currency === 'gems' ? 'text-purple-400' : 'text-blue-400'
                            }`}>
                              {item.price.toLocaleString()}
                            </span>
                          </div>

                          <WitchcraftButton
                            onClick={() => handlePurchase(item)}
                            spellType="transmutation"
                            size="sm"
                            disabled={!canAfford || !meetsLevel || isOwned}
                          >
                            {isOwned ? 'Owned' : !meetsLevel ? 'Lv. ' + item.requiredLevel :
                             !canAfford ? 'Insufficient' : 'Purchase'}
                          </WitchcraftButton>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Crystal Collection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Crystal Collection</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {crystalTypes.map(crystal => {
                  const count = userProfile.crystalInventory[crystal.id] || 0;
                  return (
                    <div
                      key={crystal.id}
                      className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: crystal.color }}
                        />
                        <span className="text-sm text-white font-medium">
                          {crystal.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-purple-300">
                          {count}
                        </span>
                        <Badge variant="outline" className={getRarityColor(crystal.rarity)}>
                          {crystal.rarity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {getElementalIcon(crystal.elementalAffinity)}
                        <span className="text-xs text-purple-400">
                          {crystal.value} coins
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Transactions */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
              <div className="space-y-2">
                {transactions.slice(0, 5).map(transaction => (
                  <div
                    key={transaction.id}
                    className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'earn' ? 'bg-green-600/20' :
                          transaction.type === 'spend' ? 'bg-red-600/20' :
                          'bg-blue-600/20'
                        }`}>
                          {transaction.type === 'earn' && <TrendingUp className="h-4 w-4 text-green-400" />}
                          {transaction.type === 'spend' && <ShoppingCart className="h-4 w-4 text-red-400" />}
                          {transaction.type === 'reward' && <Gift className="h-4 w-4 text-blue-400" />}
                        </div>
                        <div>
                          <div className="text-sm text-white">{transaction.description}</div>
                          <div className="text-xs text-purple-300">
                            {transaction.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className={`font-bold ${
                        transaction.type === 'earn' ? 'text-green-400' :
                        transaction.type === 'spend' ? 'text-red-400' : 'text-blue-400'
                      }`}>
                        {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                        <span className="text-xs ml-1">
                          {transaction.crystalType === 'coins' ? 'coins' :
                           transaction.crystalType === 'gems' ? 'gems' : 'essence'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}