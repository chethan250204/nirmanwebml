"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", projects: 4, completed: 3 },
  { month: "Feb", projects: 6, completed: 5 },
  { month: "Mar", projects: 8, completed: 6 },
  { month: "Apr", projects: 5, completed: 4 },
  { month: "May", projects: 9, completed: 7 },
  { month: "Jun", projects: 7, completed: 6 },
]

const chartConfig = {
  projects: {
    label: "Total Projects",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
}

export function ProjectsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="projects" fill="var(--color-projects)" />
        <Bar dataKey="completed" fill="var(--color-completed)" />
      </BarChart>
    </ChartContainer>
  )
}
