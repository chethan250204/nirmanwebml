import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: number
  email: string
  password: string
  role: "owner" | "contractor"
  firstName?: string
  lastName?: string
  companyName?: string
  phone?: string
  address?: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: number
  ownerId: number
  title: string
  description: string
  budget: number
  location: string
  category: string
  specifications?: string
  deadline: Date
  status: "draft" | "active" | "bidding" | "awarded" | "in_progress" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface Bid {
  id: number
  projectId: number
  contractorId: number
  totalCost: number
  materialsCost?: number
  laborCost?: number
  equipmentCost?: number
  overheadCost?: number
  startDate?: Date
  completionDate?: Date
  projectPhases?: string
  milestones?: string
  technicalRisks?: string
  financialRisks?: string
  timelineRisks?: string
  mitigationStrategies?: string
  permits?: string
  regulations?: string
  standards?: string
  certifications?: string
  profitMargin?: number
  roi?: number
  breakevenPoint?: string
  contingency?: number
  status: "draft" | "submitted" | "under_review" | "accepted" | "rejected" | "withdrawn"
  aiAnalysis?: any
  createdAt: Date
  updatedAt: Date
}

// User functions
export async function createUser(userData: {
  email: string
  password: string
  role: "owner" | "contractor"
  firstName?: string
  lastName?: string
}) {
  const result = await sql`
    INSERT INTO users (email, password, role, first_name, last_name)
    VALUES (${userData.email}, ${userData.password}, ${userData.role}, ${userData.firstName || null}, ${userData.lastName || null})
    RETURNING *
  `
  return result[0] as User
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
  return result[0] as User | undefined
}

export async function getUserById(id: number) {
  const result = await sql`
    SELECT * FROM users WHERE id = ${id}
  `
  return result[0] as User | undefined
}

export async function updateUser(id: number, updates: Partial<User>) {
  const setClause = Object.entries(updates)
    .filter(([key, value]) => value !== undefined && key !== "id")
    .map(([key, value]) => `${key} = ${value}`)
    .join(", ")

  if (!setClause) return null

  const result = await sql`
    UPDATE users 
    SET ${sql.unsafe(setClause)}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return result[0] as User
}

// Project functions
export async function createProject(projectData: {
  ownerId: number
  title: string
  description: string
  budget: number
  location: string
  category: string
  specifications?: string
  deadline: Date
}) {
  const result = await sql`
    INSERT INTO projects (owner_id, title, description, budget, location, category, specifications, deadline)
    VALUES (${projectData.ownerId}, ${projectData.title}, ${projectData.description}, 
            ${projectData.budget}, ${projectData.location}, ${projectData.category}, 
            ${projectData.specifications || null}, ${projectData.deadline})
    RETURNING *
  `
  return result[0] as Project
}

export async function getProjectsByOwnerId(ownerId: number) {
  const result = await sql`
    SELECT * FROM projects WHERE owner_id = ${ownerId} ORDER BY created_at DESC
  `
  return result as Project[]
}

export async function getActiveProjects() {
  const result = await sql`
    SELECT * FROM projects WHERE status IN ('active', 'bidding') ORDER BY created_at DESC
  `
  return result as Project[]
}

export async function getProjectById(id: number) {
  const result = await sql`
    SELECT * FROM projects WHERE id = ${id}
  `
  return result[0] as Project | undefined
}

export async function updateProjectStatus(id: number, status: Project["status"]) {
  const result = await sql`
    UPDATE projects SET status = ${status}, updated_at = NOW() WHERE id = ${id} RETURNING *
  `
  return result[0] as Project
}

// Bid functions
export async function createBid(bidData: {
  projectId: number
  contractorId: number
  totalCost: number
  materialsCost?: number
  laborCost?: number
  equipmentCost?: number
  overheadCost?: number
  startDate?: Date
  completionDate?: Date
  projectPhases?: string
  milestones?: string
  technicalRisks?: string
  financialRisks?: string
  timelineRisks?: string
  mitigationStrategies?: string
  permits?: string
  regulations?: string
  standards?: string
  certifications?: string
  profitMargin?: number
  roi?: number
  breakevenPoint?: string
  contingency?: number
  aiAnalysis?: any
}) {
  const result = await sql`
    INSERT INTO bids (
      project_id, contractor_id, total_cost, materials_cost, labor_cost, equipment_cost, overhead_cost,
      start_date, completion_date, project_phases, milestones, technical_risks, financial_risks,
      timeline_risks, mitigation_strategies, permits, regulations, standards, certifications,
      profit_margin, roi, breakeven_point, contingency, ai_analysis
    )
    VALUES (
      ${bidData.projectId}, ${bidData.contractorId}, ${bidData.totalCost}, 
      ${bidData.materialsCost || null}, ${bidData.laborCost || null}, ${bidData.equipmentCost || null}, 
      ${bidData.overheadCost || null}, ${bidData.startDate || null}, ${bidData.completionDate || null},
      ${bidData.projectPhases || null}, ${bidData.milestones || null}, ${bidData.technicalRisks || null},
      ${bidData.financialRisks || null}, ${bidData.timelineRisks || null}, ${bidData.mitigationStrategies || null},
      ${bidData.permits || null}, ${bidData.regulations || null}, ${bidData.standards || null},
      ${bidData.certifications || null}, ${bidData.profitMargin || null}, ${bidData.roi || null},
      ${bidData.breakevenPoint || null}, ${bidData.contingency || null}, ${JSON.stringify(bidData.aiAnalysis) || null}
    )
    RETURNING *
  `

  // Parse the result to ensure proper data types
  const bid = result[0] as any
  return {
    ...bid,
    totalCost: Number(bid.total_cost) || 0,
    materialsCost: bid.materials_cost ? Number(bid.materials_cost) : null,
    laborCost: bid.labor_cost ? Number(bid.labor_cost) : null,
    equipmentCost: bid.equipment_cost ? Number(bid.equipment_cost) : null,
    overheadCost: bid.overhead_cost ? Number(bid.overhead_cost) : null,
    profitMargin: bid.profit_margin ? Number(bid.profit_margin) : null,
    roi: bid.roi ? Number(bid.roi) : null,
    contingency: bid.contingency ? Number(bid.contingency) : null,
    aiAnalysis: bid.ai_analysis
      ? typeof bid.ai_analysis === "string"
        ? JSON.parse(bid.ai_analysis)
        : bid.ai_analysis
      : null,
    projectPhases: bid.project_phases,
    technicalRisks: bid.technical_risks,
    financialRisks: bid.financial_risks,
    timelineRisks: bid.timeline_risks,
    mitigationStrategies: bid.mitigation_strategies,
    breakevenPoint: bid.breakeven_point,
    startDate: bid.start_date,
    completionDate: bid.completion_date,
    createdAt: bid.created_at,
    updatedAt: bid.updated_at,
    projectId: bid.project_id,
    contractorId: bid.contractor_id,
  } as Bid
}

export async function getBidsByProjectId(projectId: number) {
  const result = await sql`
    SELECT 
      b.*,
      CONCAT(u.first_name, ' ', u.last_name) as contractor_name,
      u.company_name,
      p.title as project_title,
      p.location as project_location
    FROM bids b
    JOIN users u ON b.contractor_id = u.id
    JOIN projects p ON b.project_id = p.id
    WHERE b.project_id = ${projectId}
    ORDER BY b.created_at DESC
  `

  return result.map((bid: any) => ({
    id: bid.id,
    projectId: bid.project_id,
    contractorId: bid.contractor_id,
    totalCost: Number(bid.total_cost) || 0,
    materialsCost: bid.materials_cost ? Number(bid.materials_cost) : null,
    laborCost: bid.labor_cost ? Number(bid.labor_cost) : null,
    equipmentCost: bid.equipment_cost ? Number(bid.equipment_cost) : null,
    overheadCost: bid.overhead_cost ? Number(bid.overhead_cost) : null,
    profitMargin: bid.profit_margin ? Number(bid.profit_margin) : null,
    roi: bid.roi ? Number(bid.roi) : null,
    contingency: bid.contingency ? Number(bid.contingency) : null,
    startDate: bid.start_date,
    completionDate: bid.completion_date,
    projectPhases: bid.project_phases,
    milestones: bid.milestones,
    technicalRisks: bid.technical_risks,
    financialRisks: bid.financial_risks,
    timelineRisks: bid.timeline_risks,
    mitigationStrategies: bid.mitigation_strategies,
    permits: bid.permits,
    regulations: bid.regulations,
    standards: bid.standards,
    certifications: bid.certifications,
    breakevenPoint: bid.breakeven_point,
    status: bid.status,
    aiAnalysis: bid.ai_analysis
      ? typeof bid.ai_analysis === "string"
        ? JSON.parse(bid.ai_analysis)
        : bid.ai_analysis
      : null,
    createdAt: bid.created_at,
    updatedAt: bid.updated_at,
    contractorName: bid.contractor_name,
    companyName: bid.company_name,
    projectTitle: bid.project_title,
    projectLocation: bid.project_location,
  }))
}

export async function getBidsByOwnerId(ownerId: number) {
  const result = await sql`
    SELECT 
      b.*,
      CONCAT(u.first_name, ' ', u.last_name) as contractor_name,
      u.company_name,
      p.title as project_title,
      p.location as project_location
    FROM bids b
    JOIN users u ON b.contractor_id = u.id
    JOIN projects p ON b.project_id = p.id
    WHERE p.owner_id = ${ownerId}
    ORDER BY b.created_at DESC
  `

  return result.map((bid: any) => ({
    id: bid.id,
    projectId: bid.project_id,
    contractorId: bid.contractor_id,
    totalCost: Number(bid.total_cost) || 0,
    materialsCost: bid.materials_cost ? Number(bid.materials_cost) : null,
    laborCost: bid.labor_cost ? Number(bid.labor_cost) : null,
    equipmentCost: bid.equipment_cost ? Number(bid.equipment_cost) : null,
    overheadCost: bid.overhead_cost ? Number(bid.overhead_cost) : null,
    profitMargin: bid.profit_margin ? Number(bid.profit_margin) : null,
    roi: bid.roi ? Number(bid.roi) : null,
    contingency: bid.contingency ? Number(bid.contingency) : null,
    startDate: bid.start_date,
    completionDate: bid.completion_date,
    projectPhases: bid.project_phases,
    milestones: bid.milestones,
    technicalRisks: bid.technical_risks,
    financialRisks: bid.financial_risks,
    timelineRisks: bid.timeline_risks,
    mitigationStrategies: bid.mitigation_strategies,
    permits: bid.permits,
    regulations: bid.regulations,
    standards: bid.standards,
    certifications: bid.certifications,
    breakevenPoint: bid.breakeven_point,
    status: bid.status,
    aiAnalysis: bid.ai_analysis
      ? typeof bid.ai_analysis === "string"
        ? JSON.parse(bid.ai_analysis)
        : bid.ai_analysis
      : null,
    createdAt: bid.created_at,
    updatedAt: bid.updated_at,
    contractorName: bid.contractor_name,
    companyName: bid.company_name,
    projectTitle: bid.project_title,
    projectLocation: bid.project_location,
  }))
}

export async function getBidById(id: number) {
  const result = await sql`
    SELECT 
      b.*,
      CONCAT(u.first_name, ' ', u.last_name) as contractor_name,
      u.company_name,
      p.title as project_title,
      p.location as project_location
    FROM bids b
    JOIN users u ON b.contractor_id = u.id
    JOIN projects p ON b.project_id = p.id
    WHERE b.id = ${id}
  `

  if (!result[0]) return undefined

  const bid = result[0] as any
  return {
    id: bid.id,
    projectId: bid.project_id,
    contractorId: bid.contractor_id,
    totalCost: Number(bid.total_cost) || 0,
    materialsCost: bid.materials_cost ? Number(bid.materials_cost) : null,
    laborCost: bid.labor_cost ? Number(bid.labor_cost) : null,
    equipmentCost: bid.equipment_cost ? Number(bid.equipment_cost) : null,
    overheadCost: bid.overhead_cost ? Number(bid.overhead_cost) : null,
    profitMargin: bid.profit_margin ? Number(bid.profit_margin) : null,
    roi: bid.roi ? Number(bid.roi) : null,
    contingency: bid.contingency ? Number(bid.contingency) : null,
    startDate: bid.start_date,
    completionDate: bid.completion_date,
    projectPhases: bid.project_phases,
    milestones: bid.milestones,
    technicalRisks: bid.technical_risks,
    financialRisks: bid.financial_risks,
    timelineRisks: bid.timeline_risks,
    mitigationStrategies: bid.mitigation_strategies,
    permits: bid.permits,
    regulations: bid.regulations,
    standards: bid.standards,
    certifications: bid.certifications,
    breakevenPoint: bid.breakeven_point,
    status: bid.status,
    aiAnalysis: bid.ai_analysis
      ? typeof bid.ai_analysis === "string"
        ? JSON.parse(bid.ai_analysis)
        : bid.ai_analysis
      : null,
    createdAt: bid.created_at,
    updatedAt: bid.updated_at,
    contractorName: bid.contractor_name,
    companyName: bid.company_name,
    projectTitle: bid.project_title,
    projectLocation: bid.project_location,
  }
}

export async function getBidsByContractorId(contractorId: number) {
  const result = await sql`
    SELECT 
      b.*,
      p.title as project_title, 
      p.location as project_location
    FROM bids b
    JOIN projects p ON b.project_id = p.id
    WHERE b.contractor_id = ${contractorId}
    ORDER BY b.created_at DESC
  `

  return result.map((bid: any) => ({
    id: bid.id,
    projectId: bid.project_id,
    contractorId: bid.contractor_id,
    totalCost: Number(bid.total_cost) || 0,
    materialsCost: bid.materials_cost ? Number(bid.materials_cost) : null,
    laborCost: bid.labor_cost ? Number(bid.labor_cost) : null,
    equipmentCost: bid.equipment_cost ? Number(bid.equipment_cost) : null,
    overheadCost: bid.overhead_cost ? Number(bid.overhead_cost) : null,
    profitMargin: bid.profit_margin ? Number(bid.profit_margin) : null,
    roi: bid.roi ? Number(bid.roi) : null,
    contingency: bid.contingency ? Number(bid.contingency) : null,
    startDate: bid.start_date,
    completionDate: bid.completion_date,
    projectPhases: bid.project_phases,
    milestones: bid.milestones,
    technicalRisks: bid.technical_risks,
    financialRisks: bid.financial_risks,
    timelineRisks: bid.timeline_risks,
    mitigationStrategies: bid.mitigation_strategies,
    permits: bid.permits,
    regulations: bid.regulations,
    standards: bid.standards,
    certifications: bid.certifications,
    breakevenPoint: bid.breakeven_point,
    status: bid.status,
    aiAnalysis: bid.ai_analysis
      ? typeof bid.ai_analysis === "string"
        ? JSON.parse(bid.ai_analysis)
        : bid.ai_analysis
      : null,
    createdAt: bid.created_at,
    updatedAt: bid.updated_at,
    projectTitle: bid.project_title,
    projectLocation: bid.project_location,
  }))
}

export async function updateBidStatus(id: number, status: Bid["status"]) {
  const result = await sql`
    UPDATE bids SET status = ${status}, updated_at = NOW() WHERE id = ${id} RETURNING *
  `

  const bid = result[0] as any
  return {
    ...bid,
    totalCost: Number(bid.total_cost) || 0,
    materialsCost: bid.materials_cost ? Number(bid.materials_cost) : null,
    laborCost: bid.labor_cost ? Number(bid.labor_cost) : null,
    equipmentCost: bid.equipment_cost ? Number(bid.equipment_cost) : null,
    overheadCost: bid.overhead_cost ? Number(bid.overhead_cost) : null,
    profitMargin: bid.profit_margin ? Number(bid.profit_margin) : null,
    roi: bid.roi ? Number(bid.roi) : null,
    contingency: bid.contingency ? Number(bid.contingency) : null,
    aiAnalysis: bid.ai_analysis
      ? typeof bid.ai_analysis === "string"
        ? JSON.parse(bid.ai_analysis)
        : bid.ai_analysis
      : null,
    projectId: bid.project_id,
    contractorId: bid.contractor_id,
    startDate: bid.start_date,
    completionDate: bid.completion_date,
    projectPhases: bid.project_phases,
    technicalRisks: bid.technical_risks,
    financialRisks: bid.financial_risks,
    timelineRisks: bid.timeline_risks,
    mitigationStrategies: bid.mitigation_strategies,
    breakevenPoint: bid.breakeven_point,
    createdAt: bid.created_at,
    updatedAt: bid.updated_at,
  } as Bid
}

// Analytics functions
export async function getOwnerStats(ownerId: number) {
  const [projectStats, bidStats] = await Promise.all([
    sql`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status IN ('active', 'bidding', 'in_progress') THEN 1 END) as active_projects,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
        AVG(budget) as avg_budget
      FROM projects 
      WHERE owner_id = ${ownerId}
    `,
    sql`
      SELECT 
        COUNT(*) as total_bids,
        AVG(total_cost) as avg_bid_value
      FROM bids b
      JOIN projects p ON b.project_id = p.id
      WHERE p.owner_id = ${ownerId}
    `,
  ])

  return {
    totalProjects: Number(projectStats[0]?.total_projects || 0),
    activeProjects: Number(projectStats[0]?.active_projects || 0),
    completedProjects: Number(projectStats[0]?.completed_projects || 0),
    avgBudget: Number(projectStats[0]?.avg_budget || 0),
    totalBids: Number(bidStats[0]?.total_bids || 0),
    avgBidValue: Number(bidStats[0]?.avg_bid_value || 0),
  }
}

export async function getContractorStats(contractorId: number) {
  const [bidStats, projectStats] = await Promise.all([
    sql`
      SELECT 
        COUNT(*) as total_bids,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as won_bids,
        COUNT(CASE WHEN status IN ('submitted', 'under_review') THEN 1 END) as active_bids,
        SUM(CASE WHEN status = 'accepted' THEN total_cost ELSE 0 END) as total_earnings
      FROM bids 
      WHERE contractor_id = ${contractorId}
    `,
    sql`
      SELECT COUNT(*) as active_projects
      FROM bids b
      JOIN projects p ON b.project_id = p.id
      WHERE b.contractor_id = ${contractorId} AND b.status = 'accepted' AND p.status IN ('in_progress', 'active')
    `,
  ])

  const totalBids = Number(bidStats[0]?.total_bids || 0)
  const wonBids = Number(bidStats[0]?.won_bids || 0)
  const winRate = totalBids > 0 ? Math.round((wonBids / totalBids) * 100) : 0

  return {
    totalBids,
    wonBids,
    activeBids: Number(bidStats[0]?.active_bids || 0),
    activeProjects: Number(projectStats[0]?.active_projects || 0),
    totalEarnings: Number(bidStats[0]?.total_earnings || 0),
    winRate,
  }
}
