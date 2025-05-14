import { DollarSign, Clock, CheckSquare, ListTodo } from "lucide-react"

type DashboardStatsProps = {
  totalTasks: number
  completedTasks: number
  totalHours: number
  totalInvoiceValue: number
}

export default function DashboardStats({
  totalTasks,
  completedTasks,
  totalHours,
  totalInvoiceValue,
}: DashboardStatsProps) {
  const stats = [
    {
      name: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Completed Tasks",
      value: completedTasks,
      icon: CheckSquare,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Hours Worked",
      value: totalHours.toFixed(1),
      icon: Clock,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Total Earnings",
      value: `$${totalInvoiceValue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-primary-light text-primary-dark",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-secondary-light truncate">{stat.name}</dt>
                  <dd>
                    <div className="text-lg font-medium text-secondary">{stat.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
