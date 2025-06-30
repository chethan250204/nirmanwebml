import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { BidManagement } from "@/components/bids/bid-management"
import { Header } from "@/components/layout/header"

export default async function BidsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} />

      <div className="container mx-auto px-4 py-8">
        <BidManagement userRole={user.role} userId={user.id} />
      </div>
    </div>
  )
}
