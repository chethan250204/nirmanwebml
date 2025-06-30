"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, DollarSign, MapPin, Clock, Search, Filter } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/lib/database"

export function AvailableProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [budgetFilter, setBudgetFilter] = useState("all")

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm, categoryFilter, budgetFilter])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects?type=available")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterProjects = () => {
    let filtered = projects

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((project) => project.category === categoryFilter)
    }

    // Budget filter
    if (budgetFilter !== "all") {
      filtered = filtered.filter((project) => {
        switch (budgetFilter) {
          case "under-100k":
            return project.budget < 100000
          case "100k-500k":
            return project.budget >= 100000 && project.budget < 500000
          case "500k-1m":
            return project.budget >= 500000 && project.budget < 1000000
          case "over-1m":
            return project.budget >= 1000000
          default:
            return true
        }
      })
    }

    setFilteredProjects(filtered)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Available Projects</h2>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Available Projects</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{filteredProjects.length} projects found</Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
          <Select value={budgetFilter} onValueChange={setBudgetFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Budget Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Budgets</SelectItem>
              <SelectItem value="under-100k">Under $100K</SelectItem>
              <SelectItem value="100k-500k">$100K - $500K</SelectItem>
              <SelectItem value="500k-1m">$500K - $1M</SelectItem>
              <SelectItem value="over-1m">Over $1M</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {projects.length === 0 ? "No projects available at the moment." : "No projects match your filters."}
            </p>
            {searchTerm || categoryFilter !== "all" || budgetFilter !== "all" ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("all")
                  setBudgetFilter("all")
                }}
                className="mt-4 bg-transparent"
              >
                Clear Filters
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">{project.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {project.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-semibold">${project.budget.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Deadline</p>
                      <p className="font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold">{project.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Posted</p>
                      <p className="font-semibold">{new Date(project.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Days remaining indicator */}
                <div className="mb-4">
                  {(() => {
                    const daysRemaining = Math.ceil(
                      (new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )
                    return (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {daysRemaining > 0 ? (
                            <span className={daysRemaining <= 7 ? "text-red-600 font-semibold" : "text-gray-600"}>
                              {daysRemaining} days remaining
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">Deadline passed</span>
                          )}
                        </span>
                      </div>
                    )
                  })()}
                </div>

                <div className="flex space-x-2">
                  <Link href={`/projects/${project.id}`}>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/bids/create?project=${project.id}`}>
                    <Button size="sm">Submit Bid</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
