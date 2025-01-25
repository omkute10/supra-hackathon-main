import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Zap, Shield } from "lucide-react"
import Navigation from "@/components/Navigation"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-background/95 py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Optimize Your Smart Contracts with <span className="text-primary">ASCO</span>
            </h1>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
              Enhance and optimize your Supra smart contracts development with our AI-powered platform. Deploy to the
              Supra Blockchain with confidence.
            </p>
            <Link href="/app">
              <Button size="lg" className="mr-4">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/learn-more">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose ASCO?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Code className="h-10 w-10 text-primary" />}
                title="AI-Powered Optimization"
                description="Our advanced AI analyzes and optimizes your smart contracts for better performance and lower gas fees."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="Supra Blockchain Integration"
                description="Seamlessly deploy your optimized contracts to the Supra Blockchain with just a few clicks."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-primary" />}
                title="Enhanced Security"
                description="Identify and fix potential vulnerabilities in your smart contracts before deployment."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Smart Contracts?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join the growing community of developers using ASCO to create efficient and secure smart contracts on the
              Supra Blockchain.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  )
}

