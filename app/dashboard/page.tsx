import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { OwnerDashboard } from "@/components/dashboard/owner-dashboard"
import { ContractorDashboard } from "@/components/dashboard/contractor-dashboard"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  if (user.role === "owner") {
    return <OwnerDashboard user={user} />
  } else if (user.role === "contractor") {
    return <ContractorDashboard user={user} />
  } else {
    redirect("/auth/signin")
  }
}
