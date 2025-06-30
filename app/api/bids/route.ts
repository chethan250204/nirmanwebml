import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createBid, getBidsByContractorId, getBidsByProjectId, getBidsByOwnerId } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "contractor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      projectId,
      totalCost,
      materialsCost,
      laborCost,
      equipmentCost,
      overheadCost,
      startDate,
      completionDate,
      projectPhases,
      milestones,
      technicalRisks,
      financialRisks,
      timelineRisks,
      mitigationStrategies,
      permits,
      regulations,
      standards,
      certifications,
      profitMargin,
      roi,
      breakevenPoint,
      contingency,
      aiAnalysis,
    } = body

    if (!projectId || !totalCost) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const bid = await createBid({
      projectId: Number.parseInt(projectId),
      contractorId: user.id,
      totalCost: Number.parseFloat(totalCost),
      materialsCost: materialsCost ? Number.parseFloat(materialsCost) : undefined,
      laborCost: laborCost ? Number.parseFloat(laborCost) : undefined,
      equipmentCost: equipmentCost ? Number.parseFloat(equipmentCost) : undefined,
      overheadCost: overheadCost ? Number.parseFloat(overheadCost) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      completionDate: completionDate ? new Date(completionDate) : undefined,
      projectPhases,
      milestones,
      technicalRisks,
      financialRisks,
      timelineRisks,
      mitigationStrategies,
      permits,
      regulations,
      standards,
      certifications,
      profitMargin: profitMargin ? Number.parseFloat(profitMargin) : undefined,
      roi: roi ? Number.parseFloat(roi) : undefined,
      breakevenPoint,
      contingency: contingency ? Number.parseFloat(contingency) : undefined,
      aiAnalysis,
    })

    return NextResponse.json(bid)
  } catch (error) {
    console.error("Error creating bid:", error)
    return NextResponse.json({ error: "Failed to create bid" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const userId = searchParams.get("userId")
    const role = searchParams.get("role")

    let bids

    if (projectId) {
      // Get bids for a specific project (for project owners)
      bids = await getBidsByProjectId(Number.parseInt(projectId))
    } else if (userId && role === "contractor") {
      // Get bids by a specific contractor
      bids = await getBidsByContractorId(Number.parseInt(userId))
    } else {
      // Get bids based on user role
      if (user.role === "contractor") {
        bids = await getBidsByContractorId(user.id)
      } else {
        // For owners, get all bids for their projects
        bids = await getBidsByOwnerId(user.id)
      }
    }

    return NextResponse.json(bids)
  } catch (error) {
    console.error("Error fetching bids:", error)
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 })
  }
}
