"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, DollarSign, MapPin, Building2, FileText, Clock, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Project } from "@/lib/database"

interface ProjectDetailsProps {
  project: Project
  user: any
}

export function ProjectDetails({ project, user }: ProjectDetailsProps) {
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "bidding":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const isOwner = user.role === "owner" && project.ownerId === user.id
  const isContractor = user.role === "contractor"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          {isOwner && (
            <Link href={`/projects/${project.id}/bids`}>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <FileText className="h-4 w-4" />
                View Bids
              </Button>
            </Link>
          )}
          {isContractor && (
            <Link href={`/bids/create?project=${project.id}`}>
              <Button className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Submit Bid
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl flex items-center gap-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                {project.title}
              </CardTitle>
              <CardDescription className="text-lg">{project.description}</CardDescription>
            </div>
            <Badge className={getStatusColor(project.status)} variant="secondary">
              {project.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="text-xl font-bold">{formatCurrency(project.budget)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-xl font-bold">{project.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="text-xl font-bold">{new Date(project.deadline).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Building2 className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-xl font-bold capitalize">{project.category}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          {project.specifications && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {project.specifications}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Timeline Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Project Posted</p>
                  <p className="font-semibold">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="font-semibold">{new Date(project.updatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Deadline</p>
                  <p className="font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Days Remaining</p>
                  <p className="font-semibold">
                    {Math.max(
                      0,
                      Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
                    )}{" "}
                    days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Project Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Project ID</p>
                <p className="font-semibold">#{project.id}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-semibold capitalize">{project.category}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className={getStatusColor(project.status)} variant="secondary">
                  {project.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Budget Range</p>
                <p className="font-semibold">{formatCurrency(project.budget)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Card */}
          {isContractor && (
            <Card>
              <CardHeader>
                <CardTitle>Interested in this project?</CardTitle>
                <CardDescription>Submit your bid to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/bids/create?project=${project.id}`}>
                  <Button className="w-full" size="lg">
                    Submit Bid
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 text-center">
                  Make sure to review all project details before submitting your bid
                </p>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Need More Information?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                If you have questions about this project, please contact the project owner through the platform.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Contact Owner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
