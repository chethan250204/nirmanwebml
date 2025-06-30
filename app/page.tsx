import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, TrendingUp, Shield, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"

export default async function LandingPage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Nirman 2.0</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          Next-Generation Construction Platform
        </Badge>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Revolutionize Your
          <span className="text-blue-600"> Construction Projects</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Connect project owners with qualified contractors through our intelligent bidding platform. Streamline project
          management, enhance collaboration, and drive better outcomes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Building Today
              </Button>
            </Link>
          )}
          <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Modern Construction
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to manage construction projects efficiently and profitably
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Smart Bidding System</CardTitle>
              <CardDescription>AI-powered bid analysis and optimization for contractors</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Automated cost analysis</li>
                <li>• Risk assessment tools</li>
                <li>• Compliance checking</li>
                <li>• Profitability insights</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Project Analytics</CardTitle>
              <CardDescription>Comprehensive dashboards and reporting tools</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Real-time progress tracking</li>
                <li>• Performance metrics</li>
                <li>• Cost analysis</li>
                <li>• Timeline visualization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Compliance Management</CardTitle>
              <CardDescription>Automated compliance checking and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Regulatory compliance</li>
                <li>• Document management</li>
                <li>• Audit trails</li>
                <li>• Quality assurance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Clock className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Real-time Collaboration</CardTitle>
              <CardDescription>Instant notifications and seamless communication</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Live project updates</li>
                <li>• Team messaging</li>
                <li>• File sharing</li>
                <li>• Status notifications</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-emerald-600 mb-4" />
              <CardTitle>Financial Management</CardTitle>
              <CardDescription>Complete financial oversight and budget control</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Budget tracking</li>
                <li>• Payment processing</li>
                <li>• Cost forecasting</li>
                <li>• ROI analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Building2 className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Project Portfolio</CardTitle>
              <CardDescription>Manage multiple projects with ease</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Portfolio overview</li>
                <li>• Resource allocation</li>
                <li>• Timeline management</li>
                <li>• Performance comparison</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-700">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Construction Business?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of construction professionals who trust Nirman 2.0 for their project management needs.
          </p>
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Get Started Free
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6" />
                <span className="text-xl font-bold">Nirman 2.0</span>
              </div>
              <p className="text-gray-400">The future of construction project management and bidding.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Security</li>
                <li>Integrations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Community</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nirman 2.0. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
