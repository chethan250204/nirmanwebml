import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { updateBidStatus } from "@/lib/database"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bidId = Number.parseInt(params.id)
    const { status, reason } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const validStatuses = ["submitted", "under_review", "accepted", "rejected", "withdrawn"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updatedBid = await updateBidStatus(bidId, status)

    // TODO: Create notification for status change
    // TODO: Send email notification if needed

    return NextResponse.json(updatedBid)
  } catch (error) {
    console.error("Error updating bid status:", error)
    return NextResponse.json({ error: "Failed to update bid status" }, { status: 500 })
  }
}
