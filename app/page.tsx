import Link from 'next/link';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MagicalButton3D } from '@/components/ui/MagicalButton3D';
import { MagicalCard3D } from '@/components/ui/MagicalCard3D';
import { AnimatedBackground } from '@/components/3d/AnimatedBackground';
import { ArrowRight, Sparkles, Wand2, CrystalBall, SpellBook, Flame, Heart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950 text-white relative">
      {/* 3D Animated Background */}
      <AnimatedBackground
        colorScheme="magical"
        intensity="high"
        className="fixed inset-0"
      />

      {/* Overlay for content */}
      <div className="relative z-10">

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent" />

        <div className="relative container mx-auto px-4 pt-20 pb-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Wand2 className="h-8 w-8 text-purple-400 animate-pulse" />
                <div className="text-sm text-purple-300 font-medium tracking-wider">THE WITCHCRAFT EDITION</div>
                <Wand2 className="h-8 w-8 text-purple-400 animate-pulse" />
              </div>

              <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
                  FlareForge
                </span>
                <br />
                <span className="text-4xl md:text-6xl text-purple-200">
                  Magical AI Studio
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-300 max-w-3xl mx-auto leading-relaxed">
                Where ancient witchcraft meets modern technology to create enchanted applications.
                <br />
                <span className="text-purple-400 font-semibold">✨ Cast Spells • Craft Code • Build Magic ✨</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/studio">
                <MagicalButton3D
                  variant="enchantment"
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  <Wand2 className="mr-2 h-5 w-5" />
                  Enter the Magical Studio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </MagicalButton3D>
              </Link>
              <MagicalButton3D
                variant="illusion"
                size="lg"
                className="text-lg px-8 py-6"
              >
                <CrystalBall className="mr-2 h-5 w-5" />
                Witness the Magic
              </MagicalButton3D>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-16">
              <MagicalCard3D variant="enchantment" floating={true}>
                <div className="text-center">
                  <div className="flex justify-center text-purple-400 mb-4">
                    <Wand2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Enchanted AI Agents</h3>
                  <p className="text-purple-200 text-sm">
                    Magical AI wizards cast spells to build your applications
                  </p>
                </div>
              </MagicalCard3D>

              <MagicalCard3D variant="divination" floating={true}>
                <div className="text-center">
                  <div className="flex justify-center text-pink-400 mb-4">
                    <CrystalBall className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Mystical 3D Visualization</h3>
                  <p className="text-purple-200 text-sm">
                    Watch your enchanted app manifest in crystalline 3D space
                  </p>
                </div>
              </MagicalCard3D>

              <MagicalCard3D variant="transmutation" floating={true}>
                <div className="text-center">
                  <div className="flex justify-center text-green-400 mb-4">
                    <SpellBook className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Ancient Spell Crafting</h3>
                  <p className="text-purple-200 text-sm">
                    Craft powerful spells and magical code artifacts
                  </p>
                </div>
              </MagicalCard3D>
            </div>
          </div>
        </div>
      </div>

      {/* Magical Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Forged in
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Ancient Magic
            </span>
          </h2>
          <p className="text-xl text-purple-300 max-w-2xl mx-auto">
            Where centuries-old wisdom meets cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <MagicalSystemCard
            icon={<Wand2 className="h-8 w-8" />}
            title="🧙‍♀️ Magical AI Wizards"
            description="Enchanted AI agents cast spells to manifest your vision"
            features={[
              'Oracle of Planning - Scrys the perfect architecture',
              'Enchanter of Code - Weaves spells into functional code',
              'Alchemist of Data - Transforms requirements into databases',
              'Protector of Security - Casts wards against digital threats'
            ]}
          />

          <MagicalSystemCard
            icon={<CrystalBall className="h-8 w-8" />}
            title="🔮 Mystical 3D Crystallization"
            description="Watch your enchanted application manifest in living 3D"
            features={[
              'Crystalline visualization with magical particles',
              'Interactive spell exploration and manipulation',
              'Elemental magic effects (fire, water, earth, air)',
              'Ancient rune-powered animations'
            ]}
          />

          <MagicalSystemCard
            icon={<SpellBook className="h-8 w-8" />}
            title="📖 Ancient Grimoire Library"
            description="Access forbidden knowledge and powerful incantations"
            features={[
              'Spell-crafting system for custom code generation',
              'Ancient wisdom integration from multiple traditions',
              'Magical recipe book for code transformations',
              'Elemental affinity-based optimization'
            ]}
          />

          <MagicalSystemCard
            icon={<Flame className="h-8 w-8" />}
            title="💎 Crystal Economy & Marketplace"
            description="Trade magical artifacts and enchanted code components"
            features={[
              'Crystal-based currency system (coins, gems, essence)',
              'Magical marketplace for enchanted artifacts',
              'Daily rewards and achievement system',
              'Ancient vendor trade network'
            ]}
          />
        </div>
      </div>

      {/* Magical Stack Section */}
      <div className="container mx-auto px-4 py-24 border-t border-purple-800/30">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Enchanted By</h2>
          <p className="text-xl text-purple-300">Ancient technologies and magical frameworks</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-purple-300">
          {[
            { name: 'React 18', icon: '🔮' },
            { name: 'Next.js 14', icon: '✨' },
            { name: 'Three.js', icon: '💎' },
            { name: 'TypeScript', icon: '📜' },
            { name: 'Prisma', icon: '🗿' },
            { name: 'PostgreSQL', icon: '🏺' },
            { name: 'WebSockets', icon: '🔗' },
            { name: 'Tailwind CSS', icon: '🎨' },
            { name: 'Magical AI', icon: '🧙‍♀️' }
          ].map((tech) => (
            <div key={tech.name} className="bg-purple-900/30 px-6 py-3 rounded-full border border-purple-600/30 flex items-center gap-2">
              <span className="text-lg">{tech.icon}</span>
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Magical CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Cast Your First Spell?
            </span>
          </h2>
          <p className="text-xl text-purple-300 max-w-2xl mx-auto">
            Join thousands of magical developers building the future, one enchantment at a time
          </p>
          <Link href="/studio">
            <MagicalButton3D
              variant="powerful"
              size="xl"
              className="text-xl px-12 py-8"
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Begin Your Magical Journey
              <ArrowRight className="ml-3 h-6 w-6" />
            </MagicalButton3D>
          </Link>
          <div className="flex items-center justify-center gap-4 text-sm text-purple-400">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-400" />
              <span>Crafted with ancient magic</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Powered by witchcraft</span>
            </div>
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-blue-400" />
              <span>Enchanted with wisdom</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">👑</span>
              <span className="text-cyan-300">Created by CyberSultan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MagicalFeatureCard({ icon, title, description, spellType }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  spellType: string;
}) {
  return (
    <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 group">
      <CardHeader className="text-center">
        <div className="flex justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-purple-200 text-center">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

function MagicalSystemCard({ icon, title, description, features }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/30 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600/20">
            {icon}
          </div>
          <div>
            <CardTitle className="text-2xl text-purple-300">{title}</CardTitle>
            <CardDescription className="text-purple-200">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-purple-300">
            <Sparkles className="h-3 w-3 text-purple-400" />
            {feature}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}