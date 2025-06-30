"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Brain, Calculator, Shield, TrendingUp, FileCheck, Building2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import type { Project } from "@/lib/database"

export default function CreateBidPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("project")

  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [bidData, setBidData] = useState({
    cost: {
      materials: "",
      labor: "",
      equipment: "",
      overhead: "",
      total: "",
    },
    timeline: {
      startDate: "",
      phases: "",
      completionDate: "",
      milestones: "",
    },
    riskAssessment: {
      technicalRisks: "",
      financialRisks: "",
      timelineRisks: "",
      mitigationStrategies: "",
    },
    compliance: {
      permits: "",
      regulations: "",
      standards: "",
      certifications: "",
    },
    profitability: {
      profitMargin: "",
      roi: "",
      breakeven: "",
      contingency: "",
    },
  })

  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const projectData = await response.json()
        setProject(projectData)
      }
    } catch (error) {
      console.error("Error fetching project:", error)
    }
  }

  const handleAnalyzeBid = async () => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "No project selected for analysis",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/analyze-bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          bidData,
          project,
        }),
      })

      if (response.ok) {
        const analysis = await response.json()
        setAiAnalysis(analysis)

        // Auto-fill bid fields based on AI analysis
        autoFillBidFields(analysis)

        toast({
          title: "Success",
          description: "Bid analysis completed and fields auto-filled!",
        })
      } else {
        throw new Error("Analysis failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze bid. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const autoFillBidFields = (analysis: any) => {
    if (!project) return

    // Calculate estimated costs based on project budget and AI recommendations
    const estimatedTotal = project.budget * 0.85 // Start with 85% of budget
    const materialsCost = estimatedTotal * 0.4 // 40% materials
    const laborCost = estimatedTotal * 0.35 // 35% labor
    const equipmentCost = estimatedTotal * 0.15 // 15% equipment
    const overheadCost = estimatedTotal * 0.1 // 10% overhead

    // Calculate timeline based on project complexity
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + 14) // Start in 2 weeks

    const projectDuration = Math.ceil(
      (new Date(project.deadline).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    )
    const completionDate = new Date(project.deadline)
    completionDate.setDate(completionDate.getDate() - 7) // Complete 1 week before deadline

    setBidData({
      cost: {
        materials: Math.round(materialsCost).toString(),
        labor: Math.round(laborCost).toString(),
        equipment: Math.round(equipmentCost).toString(),
        overhead: Math.round(overheadCost).toString(),
        total: Math.round(estimatedTotal).toString(),
      },
      timeline: {
        startDate: startDate.toISOString().split("T")[0],
        completionDate: completionDate.toISOString().split("T")[0],
        phases: generateProjectPhases(project),
        milestones: generateMilestones(project),
      },
      riskAssessment: {
        technicalRisks: generateTechnicalRisks(project),
        financialRisks: "Material cost fluctuations, labor availability, equipment rental rates",
        timelineRisks: "Weather delays, permit approval delays, supply chain disruptions",
        mitigationStrategies: generateMitigationStrategies(project),
      },
      compliance: {
        permits: generatePermits(project),
        regulations: generateRegulations(project),
        standards: generateStandards(project),
        certifications: "OSHA compliance, local building codes, environmental regulations",
      },
      profitability: {
        profitMargin: "15",
        roi: "18",
        breakeven: `${Math.ceil(projectDuration * 0.6)} days`,
        contingency: "10",
      },
    })
  }

  const generateProjectPhases = (project: Project) => {
    const phases = []
    phases.push("Phase 1: Site preparation and permits (2-3 weeks)")
    phases.push("Phase 2: Foundation and structural work (4-6 weeks)")

    if (project.category === "commercial" || project.category === "industrial") {
      phases.push("Phase 3: MEP (Mechanical, Electrical, Plumbing) installation (3-4 weeks)")
      phases.push("Phase 4: Interior finishing and systems testing (2-3 weeks)")
    } else if (project.category === "residential") {
      phases.push("Phase 3: Framing and roofing (2-3 weeks)")
      phases.push("Phase 4: Interior finishing and final inspections (3-4 weeks)")
    } else {
      phases.push("Phase 3: Primary construction and installation (4-5 weeks)")
      phases.push("Phase 4: Testing, commissioning, and handover (2-3 weeks)")
    }

    return phases.join("\n")
  }

  const generateMilestones = (project: Project) => {
    return `• Site mobilization and setup
• Foundation completion
• Structural work completion
• MEP rough-in completion
• Final inspections and approvals
• Project handover and documentation`
  }

  const generateTechnicalRisks = (project: Project) => {
    const risks = ["Site conditions and soil stability"]

    if (project.category === "infrastructure") {
      risks.push("Utility conflicts and relocations")
      risks.push("Traffic management during construction")
    }

    if (project.category === "commercial" || project.category === "industrial") {
      risks.push("Complex MEP system integration")
      risks.push("Specialized equipment installation")
    }

    risks.push("Weather-related delays")
    risks.push("Material availability and quality")

    return risks.join("\n")
  }

  const generateMitigationStrategies = (project: Project) => {
    return `• Conduct thorough site surveys and geotechnical analysis
• Establish relationships with multiple suppliers
• Implement weather contingency plans
• Regular quality control inspections
• Maintain buffer time in critical path activities
• Secure backup equipment and labor resources`
  }

  const generatePermits = (project: Project) => {
    const permits = ["Building permit", "Site work permit"]

    if (project.category === "infrastructure") {
      permits.push("Right-of-way permits")
      permits.push("Traffic control permits")
    }

    permits.push("Environmental permits")
    permits.push("Utility connection permits")

    return permits.join("\n")
  }

  const generateRegulations = (project: Project) => {
    return `• Local building codes and zoning requirements
• OSHA safety regulations
• Environmental protection standards
• ADA compliance requirements
• Fire safety and life safety codes`
  }

  const generateStandards = (project: Project) => {
    const standards = ["International Building Code (IBC)", "Local building standards"]

    if (project.category === "commercial" || project.category === "industrial") {
      standards.push("ASHRAE standards for HVAC")
      standards.push("NFPA fire protection standards")
    }

    standards.push("ACI concrete standards")
    standards.push("AISC steel construction standards")

    return standards.join("\n")
  }

  const handleSubmitBid = async () => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "No project selected",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          totalCost: bidData.cost.total,
          materialsCost: bidData.cost.materials,
          laborCost: bidData.cost.labor,
          equipmentCost: bidData.cost.equipment,
          overheadCost: bidData.cost.overhead,
          startDate: bidData.timeline.startDate,
          completionDate: bidData.timeline.completionDate,
          projectPhases: bidData.timeline.phases,
          milestones: bidData.timeline.milestones,
          technicalRisks: bidData.riskAssessment.technicalRisks,
          financialRisks: bidData.riskAssessment.financialRisks,
          timelineRisks: bidData.riskAssessment.timelineRisks,
          mitigationStrategies: bidData.riskAssessment.mitigationStrategies,
          permits: bidData.compliance.permits,
          regulations: bidData.compliance.regulations,
          standards: bidData.compliance.standards,
          certifications: bidData.compliance.certifications,
          profitMargin: bidData.profitability.profitMargin,
          roi: bidData.profitability.roi,
          breakevenPoint: bidData.profitability.breakeven,
          contingency: bidData.profitability.contingency,
          aiAnalysis,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Bid submitted successfully!",
        })
        router.push("/dashboard")
      } else {
        throw new Error("Failed to submit bid")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit bid. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateBidSection = (section: string, field: string, value: string) => {
    setBidData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Smart Bid</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Use our AI-powered tools to create a comprehensive and competitive bid.
          </p>
        </div>

        {/* Project Information */}
        {project && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Bidding for: {project.title}
              </CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-semibold">${project.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">{project.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold capitalize">{project.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs defaultValue="cost" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="cost">Cost</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="risk">Risk</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="profitability">Profitability</TabsTrigger>
              </TabsList>

              <TabsContent value="cost">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Cost Breakdown
                    </CardTitle>
                    <CardDescription>Provide detailed cost estimates for all project components</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="materials">Materials Cost</Label>
                        <Input
                          id="materials"
                          type="number"
                          placeholder="Enter materials cost"
                          value={bidData.cost.materials}
                          onChange={(e) => updateBidSection("cost", "materials", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="labor">Labor Cost</Label>
                        <Input
                          id="labor"
                          type="number"
                          placeholder="Enter labor cost"
                          value={bidData.cost.labor}
                          onChange={(e) => updateBidSection("cost", "labor", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="equipment">Equipment Cost</Label>
                        <Input
                          id="equipment"
                          type="number"
                          placeholder="Enter equipment cost"
                          value={bidData.cost.equipment}
                          onChange={(e) => updateBidSection("cost", "equipment", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="overhead">Overhead Cost</Label>
                        <Input
                          id="overhead"
                          type="number"
                          placeholder="Enter overhead cost"
                          value={bidData.cost.overhead}
                          onChange={(e) => updateBidSection("cost", "overhead", e.target.value)}
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="total">Total Project Cost</Label>
                      <Input
                        id="total"
                        type="number"
                        placeholder="Total cost will be calculated"
                        value={bidData.cost.total}
                        onChange={(e) => updateBidSection("cost", "total", e.target.value)}
                        className="font-semibold text-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Project Timeline
                    </CardTitle>
                    <CardDescription>Define project phases, milestones, and completion dates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Project Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={bidData.timeline.startDate}
                          onChange={(e) => updateBidSection("timeline", "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="completionDate">Completion Date</Label>
                        <Input
                          id="completionDate"
                          type="date"
                          value={bidData.timeline.completionDate}
                          onChange={(e) => updateBidSection("timeline", "completionDate", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phases">Project Phases</Label>
                      <Textarea
                        id="phases"
                        placeholder="Describe the main phases of the project..."
                        value={bidData.timeline.phases}
                        onChange={(e) => updateBidSection("timeline", "phases", e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="milestones">Key Milestones</Label>
                      <Textarea
                        id="milestones"
                        placeholder="List important milestones and deliverables..."
                        value={bidData.timeline.milestones}
                        onChange={(e) => updateBidSection("timeline", "milestones", e.target.value)}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risk">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Risk Assessment
                    </CardTitle>
                    <CardDescription>Identify potential risks and mitigation strategies</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="technicalRisks">Technical Risks</Label>
                      <Textarea
                        id="technicalRisks"
                        placeholder="Identify technical challenges and risks..."
                        value={bidData.riskAssessment.technicalRisks}
                        onChange={(e) => updateBidSection("riskAssessment", "technicalRisks", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="financialRisks">Financial Risks</Label>
                      <Textarea
                        id="financialRisks"
                        placeholder="Assess financial risks and cost overruns..."
                        value={bidData.riskAssessment.financialRisks}
                        onChange={(e) => updateBidSection("riskAssessment", "financialRisks", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timelineRisks">Timeline Risks</Label>
                      <Textarea
                        id="timelineRisks"
                        placeholder="Consider potential delays and scheduling conflicts..."
                        value={bidData.riskAssessment.timelineRisks}
                        onChange={(e) => updateBidSection("riskAssessment", "timelineRisks", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mitigationStrategies">Mitigation Strategies</Label>
                      <Textarea
                        id="mitigationStrategies"
                        placeholder="Describe how you will address identified risks..."
                        value={bidData.riskAssessment.mitigationStrategies}
                        onChange={(e) => updateBidSection("riskAssessment", "mitigationStrategies", e.target.value)}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5" />
                      Compliance & Regulations
                    </CardTitle>
                    <CardDescription>Ensure all regulatory requirements are met</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="permits">Required Permits</Label>
                      <Textarea
                        id="permits"
                        placeholder="List all required permits and licenses..."
                        value={bidData.compliance.permits}
                        onChange={(e) => updateBidSection("compliance", "permits", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regulations">Regulatory Compliance</Label>
                      <Textarea
                        id="regulations"
                        placeholder="Describe compliance with local and federal regulations..."
                        value={bidData.compliance.regulations}
                        onChange={(e) => updateBidSection("compliance", "regulations", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="standards">Industry Standards</Label>
                      <Textarea
                        id="standards"
                        placeholder="Reference applicable industry standards and codes..."
                        value={bidData.compliance.standards}
                        onChange={(e) => updateBidSection("compliance", "standards", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications</Label>
                      <Textarea
                        id="certifications"
                        placeholder="List relevant certifications and qualifications..."
                        value={bidData.compliance.certifications}
                        onChange={(e) => updateBidSection("compliance", "certifications", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profitability">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Profitability Analysis
                    </CardTitle>
                    <CardDescription>Calculate profit margins and return on investment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                        <Input
                          id="profitMargin"
                          type="number"
                          placeholder="Enter profit margin percentage"
                          value={bidData.profitability.profitMargin}
                          onChange={(e) => updateBidSection("profitability", "profitMargin", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roi">Expected ROI (%)</Label>
                        <Input
                          id="roi"
                          type="number"
                          placeholder="Enter expected ROI"
                          value={bidData.profitability.roi}
                          onChange={(e) => updateBidSection("profitability", "roi", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="breakeven">Break-even Point</Label>
                        <Input
                          id="breakeven"
                          placeholder="Enter break-even timeline"
                          value={bidData.profitability.breakeven}
                          onChange={(e) => updateBidSection("profitability", "breakeven", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contingency">Contingency (%)</Label>
                        <Input
                          id="contingency"
                          type="number"
                          placeholder="Enter contingency percentage"
                          value={bidData.profitability.contingency}
                          onChange={(e) => updateBidSection("profitability", "contingency", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* AI Analysis Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Assistant
                </CardTitle>
                <CardDescription>Get intelligent insights and auto-fill your bid</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleAnalyzeBid} disabled={isAnalyzing || !project} className="w-full mb-4">
                  {isAnalyzing ? "Analyzing..." : "Analyze & Auto-Fill Bid"}
                </Button>

                {aiAnalysis && (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Competitiveness Score</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${aiAnalysis.competitivenessScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{aiAnalysis.competitivenessScore}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Recommendations</h4>
                      {aiAnalysis.recommendations?.map((rec: string, index: number) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          {rec}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Risk Alerts</h4>
                      {aiAnalysis.riskAlerts?.map((alert: string, index: number) => (
                        <div
                          key={index}
                          className="text-sm p-2 bg-yellow-50 dark:bg-yellow-950 rounded border-l-2 border-yellow-400"
                        >
                          {alert}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bid Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Cost:</span>
                  <span className="font-semibold">
                    ${bidData.cost.total ? Number.parseInt(bidData.cost.total).toLocaleString() : "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profit Margin:</span>
                  <span className="font-semibold">{bidData.profitability.profitMargin || "0"}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Expected ROI:</span>
                  <span className="font-semibold">{bidData.profitability.roi || "0"}%</span>
                </div>
                <Separator />
                <Button onClick={handleSubmitBid} disabled={isLoading || !bidData.cost.total} className="w-full">
                  {isLoading ? "Submitting..." : "Submit Bid"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
