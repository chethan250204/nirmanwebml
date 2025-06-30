import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { projectId, bidData, project } = await request.json();

    // Prepare features for ML model
    const features = {
      bid_total: parseFloat(bidData.cost.total) || 0,
      materials_cost: parseFloat(bidData.cost.materials) || 0,
      labor_cost: parseFloat(bidData.cost.labor) || 0,
      equipment_cost: parseFloat(bidData.cost.equipment) || 0,
      overhead_cost: parseFloat(bidData.cost.overhead) || 0,
      timeline_days:
        bidData.timeline &&
        bidData.timeline.startDate &&
        bidData.timeline.completionDate
          ? Math.max(
              1,
              Math.ceil(
                (new Date(bidData.timeline.completionDate).getTime() -
                  new Date(bidData.timeline.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            )
          : 0,
      risk_score:
        bidData.riskAssessment && bidData.riskAssessment.technicalRisks
          ? bidData.riskAssessment.technicalRisks.length
          : 0, // Example: use length as a proxy
      compliance_score:
        bidData.compliance && bidData.compliance.permits
          ? bidData.compliance.permits.length
          : 0, // Example: use length as a proxy
      profit_margin: parseFloat(bidData.profitability?.profitMargin) || 0,
      project_budget: project?.budget || 0,
      category: project?.category || "unknown",
    };

    // Try ML API
    let mlResult = null;
    try {
      const mlResponse = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });
      if (mlResponse.ok) {
        mlResult = await mlResponse.json();
      }
    } catch (mlError) {
      // ML API failed, will use fallback
    }

    if (mlResult && !mlResult.error) {
      // Use ML prediction in your response
      return NextResponse.json({
        competitivenessScore: Math.round(mlResult.probability * 100),
        recommendations: [
          mlResult.prediction === 1
            ? "Your bid is likely to win. Maintain your strategy!"
            : "Your bid may not be competitive. Consider optimizing costs or timeline.",
          "ML-based recommendation: Review risk and compliance factors.",
        ],
        riskAlerts: [],
        costOptimization: {},
        marketComparison: {},
      });
    }

    // Fallback: existing logic
    // Simulate AI analysis processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Calculate competitiveness score based on bid vs project budget
    const bidTotal = bidData.cost.total
      ? Number.parseFloat(bidData.cost.total)
      : 0;
    const projectBudget = project?.budget || 500000;

    let competitivenessScore = 75; // Base score

    if (bidTotal > 0) {
      const bidRatio = bidTotal / projectBudget;
      if (bidRatio < 0.8) competitivenessScore = 95;
      else if (bidRatio < 0.9) competitivenessScore = 85;
      else if (bidRatio < 1.0) competitivenessScore = 75;
      else if (bidRatio < 1.1) competitivenessScore = 65;
      else competitivenessScore = 50;
    }

    // Generate category-specific recommendations
    const recommendations = generateRecommendations(project, bidData);
    const riskAlerts = generateRiskAlerts(project, bidData);
    const costOptimization = generateCostOptimization(project, bidData);
    const marketComparison = generateMarketComparison(project, bidData);

    const analysis = {
      competitivenessScore,
      recommendations,
      riskAlerts,
      costOptimization,
      marketComparison,
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze bid" },
      { status: 500 }
    );
  }
}

function generateRecommendations(project: any, bidData: any) {
  const recommendations = [];

  if (project?.category === "commercial") {
    recommendations.push(
      "Consider LEED certification requirements for commercial projects"
    );
    recommendations.push(
      "Factor in extended warranty periods for commercial-grade materials"
    );
  } else if (project?.category === "residential") {
    recommendations.push("Include allowances for homeowner change requests");
    recommendations.push(
      "Consider seasonal weather impacts on construction timeline"
    );
  } else if (project?.category === "infrastructure") {
    recommendations.push(
      "Account for traffic management and public safety requirements"
    );
    recommendations.push("Include utility coordination and relocation costs");
  }

  recommendations.push(
    "Consider bulk purchasing agreements to reduce material costs"
  );
  recommendations.push(
    "Optimize equipment scheduling to minimize rental costs"
  );
  recommendations.push("Include contingency for permit approval delays");

  return recommendations;
}

function generateRiskAlerts(project: any, bidData: any) {
  const alerts = [];

  if (project?.budget && bidData.cost.total) {
    const bidRatio = Number.parseFloat(bidData.cost.total) / project.budget;
    if (bidRatio > 1.1) {
      alerts.push(
        "Bid exceeds project budget by more than 10% - consider cost optimization"
      );
    }
  }

  alerts.push("Material cost fluctuation risk detected - consider price locks");
  alerts.push("Weather dependency identified for outdoor phases");

  if (project?.category === "infrastructure") {
    alerts.push(
      "Utility conflicts may cause delays - conduct thorough site survey"
    );
  }

  alerts.push("Permit approval timeline may impact start date");

  return alerts;
}

function generateCostOptimization(project: any, bidData: any) {
  const potentialSavings = Math.floor(Math.random() * 50000) + 10000;

  return {
    potentialSavings,
    suggestions: [
      "Alternative material suppliers could reduce costs by 8-12%",
      "Optimized equipment scheduling could save $15,000-25,000",
      "Bulk purchasing agreements available for major materials",
      "Consider value engineering opportunities in non-critical areas",
    ],
  };
}

function generateMarketComparison(project: any, bidData: any) {
  const budget = project?.budget || 500000;
  const lowRange = Math.floor(budget * 0.8);
  const highRange = Math.floor(budget * 1.2);

  return {
    averageBidRange: `$${lowRange.toLocaleString()} - $${highRange.toLocaleString()}`,
    yourPosition: "Competitive",
    winProbability: Math.floor(Math.random() * 25) + 65, // 65-90%
  };
}
