'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Gem,
  Sparkles,
  Star,
  Crown,
  Shield,
  Heart,
  TrendingUp,
  Clock,
  Package,
  Zap,
  Eye,
  Filter,
  Search,
  ArrowUpDown,
  Grid,
  List,
  User,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CrystalEconomy, MagicalItem } from '@/components/economy/CrystalEconomy';

// Magical Marketplace System
export interface MarketplaceItem extends MagicalItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerAvatar?: string;
  totalSales: number;
  listedAt: Date;
  viewCount: number;
  favoriteCount: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isNew?: boolean;
  isOnSale?: boolean;
  saleDiscount?: number;
  originalPrice?: number;
  estimatedDelivery?: string;
  usageInstructions?: string;
  magicalGuarantee?: number; // months
}

export interface MarketplaceReview {
  id: string;
  itemId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
}

export interface MarketplaceFilters {
  category: string;
  priceRange: [number, number];
  rarity: string[];
  sellerRating: number;
  tags: string[];
  sortBy: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'rating' | 'popular';
  viewMode: 'grid' | 'list';
}

interface MagicalMarketplaceProps {
  userId: string;
  username: string;
  onPurchase: (item: MarketplaceItem) => void;
  className?: string;
}

export function MagicalMarketplace({ userId, username, onPurchase, className = '' }: MagicalMarketplaceProps) {
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [reviews, setReviews] = useState<MarketplaceReview[]>([]);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    category: 'all',
    priceRange: [0, 10000],
    rarity: [],
    sellerRating: 0,
    tags: [],
    sortBy: 'popular',
    viewMode: 'grid'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeMarketplace();
  }, [userId]);

  const initializeMarketplace = () => {
    setIsLoading(true);

    // Initialize marketplace items
    const items: MarketplaceItem[] = [
      {
        id: 'premium_spell_book',
        name: 'Ancient Spellbook of Advanced React',
        description: 'A comprehensive collection of advanced React patterns and optimizations from the masters of the arcane arts',
        price: 2500,
        currency: 'gems',
        category: 'spells',
        rarity: 'epic',
        benefits: [
          '50+ advanced React patterns',
          'Performance optimization techniques',
          'Custom hooks library',
          'Component architecture guide',
          'Testing strategies included'
        ],
        sellerId: 'arcane_mage_001',
        sellerName: 'Arcane Mage Merlin',
        sellerRating: 4.8,
        totalSales: 156,
        listedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        viewCount: 2847,
        favoriteCount: 89,
        rating: 4.7,
        reviewCount: 42,
        tags: ['react', 'advanced', 'performance', 'patterns'],
        isNew: true,
        usageInstructions: 'Simply recite the incantations while coding to activate the magical patterns',
        magicalGuarantee: 12
      },
      {
        id: 'debugging_crystal_ball',
        name: 'Crystal Ball of Debugging',
        description: 'A mystical crystal ball that reveals bugs and their solutions before they manifest',
        price: 1200,
        currency: 'gems',
        category: 'artifacts',
        rarity: 'rare',
        benefits: [
          'Predictive bug detection',
          'Automatic bug fixing suggestions',
          'Performance bottleneck identification',
          'Code quality analysis',
          'Real-time error prevention'
        ],
        sellerId: 'oracle_delphi',
        sellerName: 'Oracle of Delphi',
        sellerRating: 4.9,
        totalSales: 289,
        listedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        viewCount: 5234,
        favoriteCount: 167,
        rating: 4.8,
        reviewCount: 78,
        tags: ['debugging', 'prediction', 'quality', 'automation'],
        isOnSale: true,
        saleDiscount: 25,
        originalPrice: 1600,
        estimatedDelivery: 'Instant delivery',
        magicalGuarantee: 6
      },
      {
        id: 'ultimate_api_enchantment',
        name: 'Ultimate API Enchantment Kit',
        description: 'Complete toolkit for creating magical, scalable, and secure API endpoints',
        price: 800,
        currency: 'coins',
        category: 'enchants',
        rarity: 'rare',
        benefits: [
          '20+ API endpoint templates',
          'Security enchantments included',
          'Rate limiting spells',
          'Documentation auto-generation',
          'Testing framework integration'
        ],
        sellerId: 'server_wizard_gandalf',
        sellerName: 'Server Wizard Gandalf',
        sellerRating: 4.6,
        totalSales: 445,
        listedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        viewCount: 3892,
        favoriteCount: 123,
        rating: 4.5,
        reviewCount: 95,
        tags: ['api', 'backend', 'security', 'scalability'],
        estimatedDelivery: 'Instant delivery',
        magicalGuarantee: 3
      },
      {
        id: 'productivity_potion_bundle',
        name: 'Productivity Potion Bundle (5x)',
        description: 'A bundle of 5 magical potions that double your coding productivity for 2 hours each',
        price: 450,
        currency: 'coins',
        category: 'potions',
        rarity: 'uncommon',
        benefits: [
          '5 productivity potions',
          '2 hours effect per potion',
          'Stackable with other boosts',
          'No side effects',
          'Portable bottle design'
        ],
        sellerId: 'potion_master_snape',
        sellerName: 'Potion Master Snape',
        sellerRating: 4.4,
        totalSales: 1223,
        listedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        viewCount: 7821,
        favoriteCount: 234,
        rating: 4.3,
        reviewCount: 156,
        tags: ['productivity', 'focus', 'time', 'bundle'],
        isLimited: true,
        stock: 15,
        estimatedDelivery: 'Instant delivery',
        magicalGuarantee: 1
      },
      {
        id: 'css_grimoire_deluxe',
        name: 'CSS Grimoire Deluxe Edition',
        description: 'Ancient tome containing magical CSS techniques and animations that will mesmerize your users',
        price: 600,
        currency: 'coins',
        category: 'scrolls',
        rarity: 'uncommon',
        benefits: [
          '100+ CSS animations',
          'Responsive design patterns',
          'Dark mode enchantments',
          'Accessibility spells',
          'Cross-browser compatibility charms'
        ],
        sellerId: 'style_sorceress',
        sellerName: 'Style Sorceress',
        sellerRating: 4.5,
        totalSales: 678,
        listedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        viewCount: 4532,
        favoriteCount: 189,
        rating: 4.4,
        reviewCount: 67,
        tags: ['css', 'animations', 'design', 'responsive'],
        isNew: true,
        magicalGuarantee: 3
      },
      {
        id: 'database_optimization_orb',
        name: 'Database Optimization Orb',
        description: 'A mystical orb that analyzes and optimizes your database queries for maximum performance',
        price: 1500,
        currency: 'gems',
        category: 'artifacts',
        rarity: 'epic',
        benefits: [
          'Automatic query optimization',
          'Index recommendations',
          'Performance monitoring',
          'Schema optimization suggestions',
          'Real-time analysis dashboard'
        ],
        sellerId: 'data_druid',
        sellerName: 'Data Druid',
        sellerRating: 4.7,
        totalSales: 89,
        listedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        viewCount: 1923,
        favoriteCount: 67,
        rating: 4.6,
        reviewCount: 34,
        tags: ['database', 'optimization', 'performance', 'analytics'],
        magicalGuarantee: 6
      }
    ];

    // Initialize reviews
    const mockReviews: MarketplaceReview[] = [
      {
        id: '1',
        itemId: 'premium_spell_book',
        reviewerId: 'user123',
        reviewerName: 'Apprentice Developer',
        rating: 5,
        comment: 'This spellbook transformed my React development! The patterns are magical and the performance optimizations are incredible.',
        verifiedPurchase: true,
        helpfulCount: 23,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        itemId: 'debugging_crystal_ball',
        reviewerId: 'user456',
        reviewerName: 'Code Wizard',
        rating: 4,
        comment: 'The crystal ball is amazing! It catches bugs before they happen. Only downside is it sometimes shows visions of future bugs that haven\'t been written yet.',
        verifiedPurchase: true,
        helpfulCount: 15,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        itemId: 'productivity_potion_bundle',
        reviewerId: 'user789',
        reviewerName: 'Speed Coder',
        rating: 5,
        comment: 'These potions are incredible! I completed a week\'s worth of work in 2 hours. The effects are exactly as described.',
        verifiedPurchase: true,
        helpfulCount: 31,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    setMarketplaceItems(items);
    setReviews(mockReviews);
    setIsLoading(false);
  };

  const handlePurchase = (item: MarketplaceItem) => {
    // Add transaction logic here
    onPurchase(item);

    // Update total sales
    setMarketplaceItems(prev => prev.map(i =>
      i.id === item.id ? { ...i, totalSales: i.totalSales + 1 } : i
    ));
  };

  const handleToggleFavorite = (itemId: string) => {
    setMarketplaceItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, favoriteCount: item.favoriteCount + 1 }
        : item
    ));
  };

  const getItemReviews = (itemId: string) => {
    return reviews.filter(review => review.itemId === itemId);
  };

  const filteredAndSortedItems = marketplaceItems
    .filter(item => {
      // Search filter
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }

      // Price range filter
      const finalPrice = item.isOnSale && item.saleDiscount
        ? item.originalPrice! * (1 - item.saleDiscount / 100)
        : item.price;
      if (finalPrice < filters.priceRange[0] || finalPrice > filters.priceRange[1]) {
        return false;
      }

      // Rarity filter
      if (filters.rarity.length > 0 && !filters.rarity.includes(item.rarity)) {
        return false;
      }

      // Seller rating filter
      if (filters.sellerRating > 0 && item.sellerRating < filters.sellerRating) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return b.listedAt.getTime() - a.listedAt.getTime();
        case 'oldest':
          return a.listedAt.getTime() - b.listedAt.getTime();
        case 'price_low':
          const aPrice = a.isOnSale && a.saleDiscount
            ? a.originalPrice! * (1 - a.saleDiscount / 100)
            : a.price;
          const bPrice = b.isOnSale && b.saleDiscount
            ? b.originalPrice! * (1 - b.saleDiscount / 100)
            : b.price;
          return aPrice - bPrice;
        case 'price_high':
          const aPriceHigh = a.isOnSale && a.saleDiscount
            ? a.originalPrice! * (1 - a.saleDiscount / 100)
            : a.price;
          const bPriceHigh = b.isOnSale && b.saleDiscount
            ? b.originalPrice! * (1 - b.saleDiscount / 100)
            : b.price;
          return bPriceHigh - aPriceHigh;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return b.viewCount - a.viewCount;
        default:
          return 0;
      }
    });

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

  const renderStars = (rating: number, size = 'text-sm') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
        <span className={`${size} text-gray-300 ml-1`}>{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`h-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-white">Loading magical marketplace...</div>
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
                <ShoppingBag className="h-8 w-8 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Magical Marketplace</h2>
                <p className="text-sm text-purple-300">Discover enchanted artifacts from master wizards</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-purple-300">Total Items</div>
                <div className="text-lg font-bold text-purple-400">
                  {marketplaceItems.length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-purple-300">Active Sellers</div>
                <div className="text-lg font-bold text-purple-400">
                  {new Set(marketplaceItems.map(item => item.sellerId)).size}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search magical items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              <option value="all">All Categories</option>
              <option value="spells">Spells</option>
              <option value="artifacts">Artifacts</option>
              <option value="potions">Potions</option>
              <option value="scrolls">Scrolls</option>
              <option value="runes">Runes</option>
              <option value="enchants">Enchants</option>
            </select>

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-4 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-1 bg-purple-900/50 border border-purple-500/20 rounded-lg p-1">
              <button
                onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
                className={`p-2 rounded ${filters.viewMode === 'grid' ? 'bg-purple-600' : ''}`}
              >
                <Grid className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, viewMode: 'list' }))}
                className={`p-2 rounded ${filters.viewMode === 'list' ? 'bg-purple-600' : ''}`}
              >
                <List className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {searchQuery ? `Search Results (${filteredAndSortedItems.length})` :
                 filters.category === 'all' ? `All Items (${filteredAndSortedItems.length})` :
                 `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} (${filteredAndSortedItems.length})`}
              </h3>
            </div>

            {/* Items Grid/List */}
            {filters.viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAndSortedItems.map(item => {
                  const finalPrice = item.isOnSale && item.saleDiscount
                    ? item.originalPrice! * (1 - item.saleDiscount / 100)
                    : item.price;

                  return (
                    <Card
                      key={item.id}
                      className="bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-purple-400 transition-all cursor-pointer group"
                      onClick={() => setSelectedItem(item)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600/20">
                              <Sparkles className="h-4 w-4 text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-sm text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                                {item.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={getRarityColor(item.rarity)}>
                                  {item.rarity}
                                </Badge>
                                {item.isNew && (
                                  <Badge variant="outline" className="text-green-400 border-green-400">
                                    New
                                  </Badge>
                                )}
                                {item.isOnSale && (
                                  <Badge variant="outline" className="text-red-400 border-red-400">
                                    -{item.saleDiscount}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(item.id);
                            }}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <CardDescription className="text-xs text-purple-200 line-clamp-2">
                            {item.description}
                          </CardDescription>

                          {/* Seller Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                                <User className="h-3 w-3 text-white" />
                              </div>
                              <div>
                                <div className="text-xs text-white font-medium">
                                  {item.sellerName}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                  <span className="text-xs text-purple-300">
                                    {item.sellerRating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-purple-300">
                              {item.totalSales} sold
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-xs text-purple-300">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{item.viewCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              <span>{item.favoriteCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{item.reviewCount}</span>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center justify-between">
                            {renderStars(item.rating, 'text-xs')}
                            <div className="text-xs text-purple-300">
                              {item.reviewCount} reviews
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
                            <div>
                              <div className="flex items-center gap-2">
                                {item.currency === 'coins' && <div className="w-4 h-4 bg-yellow-400 rounded-full" />}
                                {item.currency === 'gems' && <Gem className="h-4 w-4 text-purple-400" />}
                                <span className={`font-bold text-lg ${
                                  item.currency === 'coins' ? 'text-yellow-400' : 'text-purple-400'
                                }`}>
                                  {Math.round(finalPrice).toLocaleString()}
                                </span>
                              </div>
                              {item.isOnSale && item.originalPrice && (
                                <div className="text-xs text-gray-400 line-through">
                                  {Math.round(item.originalPrice).toLocaleString()}
                                </div>
                              )}
                            </div>
                            <WitchcraftButton
                              spellType="transmutation"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePurchase(item);
                              }}
                            >
                              Purchase
                            </WitchcraftButton>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              // List View
              <div className="space-y-4">
                {filteredAndSortedItems.map(item => {
                  const finalPrice = item.isOnSale && item.saleDiscount
                    ? item.originalPrice! * (1 - item.saleDiscount / 100)
                    : item.price;

                  return (
                    <Card
                      key={item.id}
                      className="bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-purple-400 transition-all cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600/20">
                              <Sparkles className="h-6 w-6 text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-semibold text-white">{item.name}</h4>
                                <Badge variant="outline" className={getRarityColor(item.rarity)}>
                                  {item.rarity}
                                </Badge>
                                {item.isNew && (
                                  <Badge variant="outline" className="text-green-400 border-green-400">
                                    New
                                  </Badge>
                                )}
                                {item.isOnSale && (
                                  <Badge variant="outline" className="text-red-400 border-red-400">
                                    -{item.saleDiscount}%
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-purple-200 mb-2">{item.description}</p>
                              <div className="flex items-center gap-4 text-xs text-purple-300">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>{item.sellerName}</span>
                                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                  <span>{item.sellerRating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  <span>{item.totalSales} sold</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{item.viewCount} views</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-2">
                              {item.currency === 'coins' && <div className="w-4 h-4 bg-yellow-400 rounded-full" />}
                              {item.currency === 'gems' && <Gem className="h-4 w-4 text-purple-400" />}
                              <span className={`font-bold text-xl ${
                                item.currency === 'coins' ? 'text-yellow-400' : 'text-purple-400'
                              }`}>
                                {Math.round(finalPrice).toLocaleString()}
                              </span>
                            </div>
                            {item.isOnSale && item.originalPrice && (
                              <div className="text-xs text-gray-400 line-through mb-2">
                                {Math.round(item.originalPrice).toLocaleString()}
                              </div>
                            )}
                            <div className="flex items-center gap-1 mb-2">
                              {renderStars(item.rating, 'text-xs')}
                              <span className="text-xs text-purple-300">({item.reviewCount})</span>
                            </div>
                            <WitchcraftButton
                              spellType="transmutation"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePurchase(item);
                              }}
                            >
                              Purchase
                            </WitchcraftButton>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-black/60 backdrop-blur-sm border border-purple-500/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">{selectedItem.name}</h2>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className={getRarityColor(selectedItem.rarity)}>
                        {selectedItem.rarity}
                      </Badge>
                      {selectedItem.isNew && (
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          New
                        </Badge>
                      )}
                      {selectedItem.isOnSale && (
                        <Badge variant="outline" className="text-red-400 border-red-400">
                          Sale -{selectedItem.saleDiscount}%!
                        </Badge>
                      )}
                    </div>

                    <p className="text-purple-200 mb-4">{selectedItem.description}</p>

                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Magical Benefits</h3>
                      <ul className="space-y-1">
                        {selectedItem.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-purple-300">
                            <Sparkles className="h-3 w-3 text-purple-400" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {selectedItem.tags.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Magical Tags</h3>
                        <div className="flex gap-2 flex-wrap">
                          {selectedItem.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-purple-300 border-purple-400">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-sm text-purple-300 mb-1">Price</div>
                          <div className="flex items-center gap-2">
                            {selectedItem.currency === 'coins' && <div className="w-6 h-6 bg-yellow-400 rounded-full" />}
                            {selectedItem.currency === 'gems' && <Gem className="h-6 w-6 text-purple-400" />}
                            <span className={`font-bold text-2xl ${
                              selectedItem.currency === 'coins' ? 'text-yellow-400' : 'text-purple-400'
                            }`}>
                              {selectedItem.isOnSale && selectedItem.saleDiscount && selectedItem.originalPrice
                                ? Math.round(selectedItem.originalPrice * (1 - selectedItem.saleDiscount / 100)).toLocaleString()
                                : selectedItem.price.toLocaleString()}
                            </span>
                          </div>
                          {selectedItem.isOnSale && selectedItem.originalPrice && (
                            <div className="text-sm text-gray-400 line-through">
                              Original: {selectedItem.originalPrice.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <WitchcraftButton
                          spellType="transmutation"
                          onClick={() => handlePurchase(selectedItem)}
                        >
                          Purchase Now
                        </WitchcraftButton>
                      </div>

                      {selectedItem.estimatedDelivery && (
                        <div className="text-sm text-purple-300 mb-2">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {selectedItem.estimatedDelivery}
                        </div>
                      )}

                      {selectedItem.magicalGuarantee && (
                        <div className="text-sm text-purple-300">
                          <Shield className="h-4 w-4 inline mr-1" />
                          {selectedItem.magicalGuarantee} months magical guarantee
                        </div>
                      )}
                    </div>

                    <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-4 mb-4">
                      <h3 className="text-lg font-semibold text-white mb-3">Seller Information</h3>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{selectedItem.sellerName}</div>
                          {renderStars(selectedItem.sellerRating)}
                        </div>
                      </div>
                      <div className="text-sm text-purple-300">
                        <div className="flex justify-between mb-1">
                          <span>Total Sales:</span>
                          <span>{selectedItem.totalSales}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Member Since:</span>
                          <span>Ancient Times</span>
                        </div>
                      </div>
                    </div>

                    {selectedItem.usageInstructions && (
                      <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Usage Instructions</h3>
                        <p className="text-sm text-purple-200">{selectedItem.usageInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-6 pt-6 border-t border-purple-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Customer Reviews</h3>
                  <div className="space-y-3">
                    {getItemReviews(selectedItem.id).map(review => (
                      <div key={review.id} className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                                      <User className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <div className="text-sm text-white font-medium">
                                        {review.reviewerName}
                                        {review.verifiedPurchase && (
                                          <Badge variant="outline" className="ml-2 text-xs text-green-400 border-green-400">
                                            Verified Purchase
                                          </Badge>
                                        )}
                                      </div>
                                      {renderStars(review.rating, 'text-xs')}
                                    </div>
                                  </div>
                                  <div className="text-xs text-purple-300">
                                    {review.createdAt.toLocaleDateString()}
                                  </div>
                                </div>
                                <p className="text-sm text-purple-200">{review.comment}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <button className="text-xs text-purple-300 hover:text-purple-200">
                                    <ThumbsUp className="h-3 w-3 inline mr-1" />
                                    Helpful ({review.helpfulCount})
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            } else (
              // List View
              <div className="space-y-4">
                {filteredAndSortedItems.map(item => {
                  const finalPrice = item.isOnSale && item.saleDiscount
                    ? item.originalPrice! * (1 - item.saleDiscount / 100)
                    : item.price;

                  return (
                    <Card
                      key={item.id}
                      className="bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-purple-400 transition-all cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600/20">
                              <Sparkles className="h-6 w-6 text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-semibold text-white">{item.name}</h4>
                                <Badge variant="outline" className={getRarityColor(item.rarity)}>
                                  {item.rarity}
                                </Badge>
                                {item.isNew && (
                                  <Badge variant="outline" className="text-green-400 border-green-400">
                                    New
                                  </Badge>
                                )}
                                {item.isOnSale && (
                                  <Badge variant="outline" className="text-red-400 border-red-400">
                                    -{item.saleDiscount}%
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-purple-200 mb-2">{item.description}</p>
                              <div className="flex items-center gap-4 text-xs text-purple-300">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>{item.sellerName}</span>
                                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                  <span>{item.sellerRating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  <span>{item.totalSales} sold</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{item.viewCount} views</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-2">
                              {item.currency === 'coins' && <div className="w-4 h-4 bg-yellow-400 rounded-full" />}
                              {item.currency === 'gems' && <Gem className="h-4 w-4 text-purple-400" />}
                              <span className={`font-bold text-xl ${
                                item.currency === 'coins' ? 'text-yellow-400' : 'text-purple-400'
                              }`}>
                                {Math.round(finalPrice).toLocaleString()}
                              </span>
                            </div>
                            {item.isOnSale && item.originalPrice && (
                              <div className="text-xs text-gray-400 line-through mb-2">
                                {Math.round(item.originalPrice).toLocaleString()}
                              </div>
                            )}
                            <div className="flex items-center gap-1 mb-2">
                              {renderStars(item.rating, 'text-xs')}
                              <span className="text-xs text-purple-300">({item.reviewCount})</span>
                            </div>
                            <WitchcraftButton
                              spellType="transmutation"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePurchase(item);
                              }}
                            >
                              Purchase
                            </WitchcraftButton>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}