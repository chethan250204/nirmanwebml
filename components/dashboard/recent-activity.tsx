import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Award, AlertCircle } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "bid_received",
    title: "New bid received for Downtown Office Complex",
    time: "2 hours ago",
    icon: FileText,
    status: "new",
  },
  {
    id: 2,
    type: "project_completed",
    title: "Residential Complex Phase 1 completed",
    time: "1 day ago",
    icon: Award,
    status: "completed",
  },
  {
    id: 3,
    type: "deadline_approaching",
    title: "Shopping Mall renovation deadline in 3 days",
    time: "2 days ago",
    icon: AlertCircle,
    status: "warning",
  },
  {
    id: 4,
    type: "bid_accepted",
    title: "Your bid for City Park Bridge was accepted",
    time: "3 days ago",
    icon: Award,
    status: "success",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activity.icon
        return (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div
              className={`p-2 rounded-full ${
                activity.status === "new"
                  ? "bg-blue-100 text-blue-600"
                  : activity.status === "completed"
                    ? "bg-green-100 text-green-600"
                    : activity.status === "warning"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">{activity.time}</span>
                <Badge
                  variant={
                    activity.status === "new"
                      ? "default"
                      : activity.status === "completed"
                        ? "secondary"
                        : activity.status === "warning"
                          ? "destructive"
                          : "secondary"
                  }
                  className="text-xs"
                >
                  {activity.status}
                </Badge>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
