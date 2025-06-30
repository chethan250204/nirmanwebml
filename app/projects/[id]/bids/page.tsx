import { getCurrentUser } from "@/lib/auth"
import { getProjectById } from "@/lib/database"
import { redirect, notFound } from "next/navigation"
import { BidManagement } from "@/components/bids/bid-management"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, MapPin, Building2 } from "lucide-react"

interface ProjectBidsPageProps {
  params: {
    id: string
  }
}

export default async function ProjectBidsPage({ params }: ProjectBidsPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const projectId = Number.parseInt(params.id)
  const project = await getProjectById(projectId)

  if (!project) {
    notFound()
  }

  // Only project owners can view bids for their projects
  if (user.role !== "owner" || project.ownerId !== user.id) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8">
        {/* Project Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Building2 className="h-6 w-6" />
                  {project.title}
                </CardTitle>
                <CardDescription className="mt-2 text-base">{project.description}</CardDescription>
              </div>
              <Badge variant={project.status === "active" ? "default" : "secondary"} className="text-sm">
                {project.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-semibold">${project.budget.toLocaleString()}</p>
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
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold capitalize">{project.category}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bid Management */}
        <BidManagement projectId={projectId} userRole={user.role} userId={user.id} />
      </div>
    </div>
  )
}
