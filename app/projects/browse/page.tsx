import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AvailableProjects } from "@/components/projects/available-projects"
import { Header } from "@/components/layout/header"

export default async function BrowseProjectsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  if (user.role !== "contractor") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Projects</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Find construction projects that match your expertise and submit competitive bids.
          </p>
        </div>

        <AvailableProjects />
      </div>
    </div>
  )
}
