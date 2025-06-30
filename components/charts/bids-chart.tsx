"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", bids: 12, won: 8 },
  { month: "Feb", bids: 15, won: 10 },
  { month: "Mar", bids: 18, won: 12 },
  { month: "Apr", bids: 14, won: 9 },
  { month: "May", bids: 20, won: 14 },
  { month: "Jun", bids: 16, won: 11 },
]

const chartConfig = {
  bids: {
    label: "Total Bids",
    color: "hsl(var(--chart-1))",
  },
  won: {
    label: "Won Bids",
    color: "hsl(var(--chart-2))",
  },
}

export function BidsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="bids" stroke="var(--color-bids)" strokeWidth={2} />
        <Line type="monotone" dataKey="won" stroke="var(--color-won)" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  )
}
