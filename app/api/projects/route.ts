import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createProject, getProjectsByOwnerId, getActiveProjects } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, budget, location, category, specifications, deadline } = body

    if (!title || !description || !budget || !location || !category || !deadline) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const project = await createProject({
      ownerId: user.id,
      title,
      description,
      budget: Number.parseFloat(budget),
      location,
      category,
      specifications,
      deadline: new Date(deadline),
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    let projects
    if (type === "available") {
      projects = await getActiveProjects()
    } else {
      projects = await getProjectsByOwnerId(user.id)
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
