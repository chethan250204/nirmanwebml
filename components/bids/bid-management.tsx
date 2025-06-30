"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  FileText,
  Award,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Bid } from "@/lib/database"

interface BidWithDetails extends Bid {
  contractorName?: string
  companyName?: string
  projectTitle?: string
  projectLocation?: string
}

interface BidManagementProps {
  projectId?: number
  userRole: "owner" | "contractor"
  userId: number
}

export function BidManagement({ projectId, userRole, userId }: BidManagementProps) {
  const [bids, setBids] = useState<BidWithDetails[]>([])
  const [selectedBid, setSelectedBid] = useState<BidWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [rejectionReason, setRejectionReason] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchBids()
  }, [projectId, userRole, userId])

  const fetchBids = async () => {
    try {
      const url = projectId ? `/api/bids?projectId=${projectId}` : `/api/bids?userId=${userId}&role=${userRole}`

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setBids(data)
      }
    } catch (error) {
      console.error("Error fetching bids:", error)
      toast({
        title: "Error",
        description: "Failed to fetch bids",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateBidStatus = async (bidId: number, status: string, reason?: string) => {
    try {
      const response = await fetch(`/api/bids/${bidId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, reason }),
      })

      if (response.ok) {
        await fetchBids()
        toast({
          title: "Success",
          description: `Bid ${status} successfully`,
        })
        setSelectedBid(null)
        setRejectionReason("")
      } else {
        throw new Error("Failed to update bid status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bid status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "withdrawn":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBids = bids.filter((bid) => statusFilter === "all" || bid.status === statusFilter)

  const getCompetitivenessScore = (bid: BidWithDetails) => {
    if (!bid.aiAnalysis) return null
    return bid.aiAnalysis.competitivenessScore || null
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "Not specified"
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "Not specified"
    }
    return `${value}%`
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Not specified"
    try {
      return new Date(date).toLocaleDateString()
    } catch {
      return "Invalid date"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Bid Management</h2>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{userRole === "owner" ? "Received Bids" : "My Bids"}</h2>
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredBids.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {statusFilter === "all" ? "No bids found" : `No bids with status "${statusFilter}"`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredBids.map((bid) => (
            <Card key={bid.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">
                      {userRole === "owner"
                        ? `${bid.contractorName || "Unknown Contractor"}${bid.companyName ? ` - ${bid.companyName}` : ""}`
                        : bid.projectTitle || "Unknown Project"}
                    </CardTitle>
                    <CardDescription>
                      {userRole === "owner"
                        ? `Bid for ${projectId ? "this project" : bid.projectTitle}`
                        : `${bid.projectLocation || ""} • Submitted ${formatDate(bid.createdAt)}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(bid.status)}>{bid.status.replace("_", " ").toUpperCase()}</Badge>
                    {getCompetitivenessScore(bid) && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {getCompetitivenessScore(bid)}% Competitive
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Total Cost</p>
                      <p className="font-semibold">{formatCurrency(bid.totalCost)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-semibold">{formatDate(bid.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Completion</p>
                      <p className="font-semibold">{formatDate(bid.completionDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Profit Margin</p>
                      <p className="font-semibold">{formatPercentage(bid.profitMargin)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedBid(bid)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Bid Details</DialogTitle>
                        <DialogDescription>Comprehensive bid information and analysis</DialogDescription>
                      </DialogHeader>
                      {selectedBid && <BidDetailsView bid={selectedBid} />}
                    </DialogContent>
                  </Dialog>

                  {userRole === "owner" && bid.status === "submitted" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateBidStatus(bid.id, "accepted")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Bid</DialogTitle>
                            <DialogDescription>Please provide a reason for rejecting this bid</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="reason">Rejection Reason</Label>
                              <Textarea
                                id="reason"
                                placeholder="Please explain why this bid is being rejected..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setRejectionReason("")}>
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => updateBidStatus(bid.id, "rejected", rejectionReason)}
                                disabled={!rejectionReason.trim()}
                              >
                                Reject Bid
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}

                  {userRole === "owner" && bid.status === "submitted" && (
                    <Button variant="outline" size="sm" onClick={() => updateBidStatus(bid.id, "under_review")}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Mark Under Review
                    </Button>
                  )}

                  {userRole === "contractor" && bid.status === "submitted" && (
                    <Button variant="outline" size="sm" onClick={() => updateBidStatus(bid.id, "withdrawn")}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Withdraw
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function BidDetailsView({ bid }: { bid: BidWithDetails }) {
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "Not specified"
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "Not specified"
    }
    return `${value}%`
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Not specified"
    try {
      return new Date(date).toLocaleDateString()
    } catch {
      return "Invalid date"
    }
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="costs">Costs</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="risks">Risks</TabsTrigger>
        <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Project</p>
                <p className="font-semibold">{bid.projectTitle || "Unknown Project"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold">{bid.projectLocation || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="font-semibold">{formatDate(bid.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contractor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Contractor</p>
                <p className="font-semibold">{bid.contractorName || "Unknown Contractor"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-semibold">{bid.companyName || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge
                  className={`${
                    bid.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : bid.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {bid.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Phases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{bid.projectPhases || "No phases specified"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{bid.milestones || "No milestones specified"}</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="costs" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Materials:</span>
                <span className="font-semibold">{formatCurrency(bid.materialsCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Labor:</span>
                <span className="font-semibold">{formatCurrency(bid.laborCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Equipment:</span>
                <span className="font-semibold">{formatCurrency(bid.equipmentCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Overhead:</span>
                <span className="font-semibold">{formatCurrency(bid.overheadCost)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(bid.totalCost)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profitability Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Profit Margin:</span>
                <span className="font-semibold">{formatPercentage(bid.profitMargin)}</span>
              </div>
              <div className="flex justify-between">
                <span>Expected ROI:</span>
                <span className="font-semibold">{formatPercentage(bid.roi)}</span>
              </div>
              <div className="flex justify-between">
                <span>Break-even Point:</span>
                <span className="font-semibold">{bid.breakevenPoint || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span>Contingency:</span>
                <span className="font-semibold">{formatPercentage(bid.contingency)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="timeline" className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span className="font-semibold">{formatDate(bid.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Completion Date:</span>
                <span className="font-semibold">{formatDate(bid.completionDate)}</span>
              </div>
              {bid.startDate && bid.completionDate && (
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold">
                    {Math.ceil(
                      (new Date(bid.completionDate).getTime() - new Date(bid.startDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="risks" className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Technical Risks</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {bid.technicalRisks || "No technical risks identified"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Financial Risks</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {bid.financialRisks || "No financial risks identified"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Timeline Risks</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {bid.timelineRisks || "No timeline risks identified"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mitigation Strategies</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {bid.mitigationStrategies || "No mitigation strategies specified"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compliance & Regulations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Required Permits</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{bid.permits || "No permits specified"}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Regulatory Compliance</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {bid.regulations || "No regulations specified"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Standards & Certifications</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{bid.standards || "No standards specified"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="analysis" className="space-y-4">
        {bid.aiAnalysis ? (
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-500" />
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="font-semibold">Competitiveness Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${bid.aiAnalysis.competitivenessScore || 0}%` }}
                      />
                    </div>
                    <span className="font-bold text-blue-600">{bid.aiAnalysis.competitivenessScore || 0}%</span>
                  </div>
                </div>

                {bid.aiAnalysis.recommendations && (
                  <div>
                    <h4 className="font-semibold mb-2">AI Recommendations</h4>
                    <ul className="space-y-1">
                      {bid.aiAnalysis.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {bid.aiAnalysis.riskAlerts && (
                  <div>
                    <h4 className="font-semibold mb-2">Risk Alerts</h4>
                    <ul className="space-y-1">
                      {bid.aiAnalysis.riskAlerts.map((alert: string, index: number) => (
                        <li key={index} className="text-sm text-yellow-600 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500" />
                          {alert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {bid.aiAnalysis.marketComparison && (
                  <div>
                    <h4 className="font-semibold mb-2">Market Comparison</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Average Bid Range:</span>
                        <p className="font-semibold">{bid.aiAnalysis.marketComparison.averageBidRange}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Market Position:</span>
                        <p className="font-semibold">{bid.aiAnalysis.marketComparison.yourPosition}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Win Probability:</span>
                        <p className="font-semibold">{bid.aiAnalysis.marketComparison.winProbability}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No AI analysis available for this bid</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}
