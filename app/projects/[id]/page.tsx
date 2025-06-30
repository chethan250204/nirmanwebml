import { getCurrentUser } from "@/lib/auth"
import { getProjectById } from "@/lib/database"
import { redirect, notFound } from "next/navigation"
import { ProjectDetails } from "@/components/projects/project-details"
import { Header } from "@/components/layout/header"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const projectId = Number.parseInt(params.id)
  const project = await getProjectById(projectId)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} />
      <div className="container mx-auto px-4 py-8">
        <ProjectDetails project={project} user={user} />
      </div>
    </div>
  )
}
