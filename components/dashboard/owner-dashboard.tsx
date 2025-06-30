"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Plus, TrendingUp, Users, DollarSign, FileText } from "lucide-react"
import Link from "next/link"
import { ProjectsChart } from "@/components/charts/projects-chart"
import { BidsChart } from "@/components/charts/bids-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ProjectsList } from "@/components/projects/projects-list"
import { Header } from "@/components/layout/header"
import type { User } from "@/lib/database"
import { BidManagement } from "@/components/bids/bid-management"

interface OwnerDashboardProps {
  user: User
}

interface Stats {
  totalProjects: number
  activeProjects: number
  totalBids: number
  avgBidValue: number
}

export function OwnerDashboard({ user }: OwnerDashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    activeProjects: 0,
    totalBids: 0,
    avgBidValue: 0,
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
                Welcome back, {user.firstName || "Owner"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Here's what's happening with your projects today.</p>
            </div>
            <Link href="/projects/new">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBids}</div>
              <p className="text-xs text-muted-foreground">Received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Bid Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.avgBidValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Per project</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="bids">Bids</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                  <CardDescription>Overview of project progress and deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectsChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bid Analysis</CardTitle>
                  <CardDescription>Bid distribution and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <BidsChart />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your projects</CardDescription>
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
                  <Link href="/projects/new">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Project
                    </Button>
                  </Link>
                  <Link href="/bids">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Review Pending Bids
                    </Button>
                  </Link>
                  <Link href="/reports">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsList />
          </TabsContent>

          <TabsContent value="bids">
            <BidManagement userRole={user.role} userId={user.id} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectsChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <BidsChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
