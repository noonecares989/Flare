import Link from 'next/link';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles, Wand2, CrystalBall, SpellBook, Flame, Heart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950 text-white">
      {/* Magical Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

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
                <WitchcraftButton spellType="enchantment" className="text-lg px-8 py-6">
                  <Wand2 className="mr-2 h-5 w-5" />
                  Enter the Magical Studio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </WitchcraftButton>
              </Link>
              <WitchcraftButton spellType="illusion" className="text-lg px-8 py-6">
                <CrystalBall className="mr-2 h-5 w-5" />
                Witness the Magic
              </WitchcraftButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-16">
              <MagicalFeatureCard
                icon={<Wand2 className="h-8 w-8" />}
                title="Enchanted AI Agents"
                description="Magical AI wizards cast spells to build your applications"
                spellType="enchantment"
              />
              <MagicalFeatureCard
                icon={<CrystalBall className="h-8 w-8" />}
                title="Mystical 3D Visualization"
                description="Watch your enchanted app manifest in crystalline 3D space"
                spellType="divination"
              />
              <MagicalFeatureCard
                icon={<SpellBook className="h-8 w-8" />}
                title="Ancient Spell Crafting"
                description="Craft powerful spells and magical code artifacts"
                spellType="transmutation"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Built for the
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Future
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Enterprise-grade tools with unlimited AI model flexibility
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-400">
                🚀 Parallel Agent Orchestration
              </CardTitle>
              <CardDescription className="text-gray-400">
                Multiple AI models work in harmony, switching automatically to the best tool for each task
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• Claude for architectural planning</p>
              <p>• GPT-4 for rapid code generation</p>
              <p>• Grok for testing and optimization</p>
              <p>• Automatic fallbacks and error recovery</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-400">
                🎨 Immersive 3D Environment
              </CardTitle>
              <CardDescription className="text-gray-400">
                Visualize your application as a living, breathing 3D model
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• Real-time particle effects</p>
              <p>• Interactive component exploration</p>
              <p>• Physics-based animations</p>
              <p>• Holographic code previews</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-400">
                💾 Zero-Lock Architecture
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your code, your control. Export anytime, anywhere
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• Export to GitHub repositories</p>
              <p>• Download as ZIP packages</p>
              <p>• Docker container generation</p>
              <p>• Full codebase ownership</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-400">
                🔗 Live Database Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                Design schemas, write queries, and visualize data in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• Visual schema designer</p>
              <p>• SQL query editor</p>
              <p>• Real-time data visualization</p>
              <p>• Automated migrations</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="container mx-auto px-4 py-24 border-t border-gray-800">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Powered By</h2>
          <p className="text-xl text-gray-400">Cutting-edge technology stack</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-gray-400">
          {[
            'Next.js 14',
            'React 18',
            'Three.js',
            'LangChain',
            'Prisma',
            'PostgreSQL',
            'WebSockets',
            'Monaco Editor',
            'Tailwind CSS',
            'TypeScript'
          ].map((tech) => (
            <div key={tech} className="bg-gray-800/50 px-6 py-3 rounded-full border border-gray-700">
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Forge?
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of developers building the future, one prompt at a time
          </p>
          <Link href="/studio">
            <Button size="lg" className="text-xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 btn-glow">
              Start Building Now
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300">
      <CardHeader className="text-center">
        <div className="flex justify-center text-purple-400 mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-400 text-center">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}