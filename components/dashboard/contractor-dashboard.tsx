"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HardHat, Search, TrendingUp, DollarSign, FileText, Award } from "lucide-react"
import Link from "next/link"
import { BidsChart } from "@/components/charts/bids-chart"
import { ProjectsChart } from "@/components/charts/projects-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { AvailableProjects } from "@/components/projects/available-projects"
import { Header } from "@/components/layout/header"
import type { User } from "@/lib/database"
import { BidManagement } from "@/components/bids/bid-management"

interface ContractorDashboardProps {
  user: User
}

interface Stats {
  totalBids: number
  wonBids: number
  activeBids: number
  activeProjects: number
  totalEarnings: number
  winRate: number
}

export function ContractorDashboard({ user }: ContractorDashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalBids: 0,
    wonBids: 0,
    activeBids: 0,
    activeProjects: 0,
    totalEarnings: 0,
    winRate: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.firstName || "Contractor"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Ready to find your next construction project?</p>
            </div>
            <Link href="/projects/browse">
              <Button className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse Projects
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeBids}</div>
              <p className="text-xs text-muted-foreground">Pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Won Projects</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.wonBids}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From won projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.winRate}%</div>
              <p className="text-xs text-muted-foreground">Success rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Available Projects</TabsTrigger>
            <TabsTrigger value="bids">My Bids</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bid Performance</CardTitle>
                  <CardDescription>Your bidding success over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <BidsChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                  <CardDescription>Current and upcoming project deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectsChart />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates on your bids and projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentActivity />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/projects/browse">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Browse Projects
                    </Button>
                  </Link>
                  <Link href="/bids/create">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Create New Bid
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <HardHat className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <AvailableProjects />
          </TabsContent>

          <TabsContent value="bids">
            <BidManagement userRole={user.role} userId={user.id} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bid Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <BidsChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectsChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
