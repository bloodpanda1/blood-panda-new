import { Badge } from '#/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { useTRPC } from '#/integrations/trpc/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  TrendingUpIcon,
  UsersIcon,
  CalendarCheckIcon,
  ZapIcon,
  CreditCardIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  IndianRupeeIcon,
  WifiIcon,
  RefreshCcwIcon,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

const operationalStats = [
  { key: 'totalBookings', label: 'Total Bookings', icon: CalendarCheckIcon, color: 'text-primary' },
  { key: 'totalCompleted', label: 'Completed Orders', icon: CheckCircleIcon, color: 'text-emerald-500' },
  { key: 'totalPendingOrders', label: 'Pending Orders', icon: ClockIcon, color: 'text-amber-500' },
  { key: 'totalCancelled', label: 'Cancelled Orders', icon: XCircleIcon, color: 'text-red-500' },
  { key: 'totalUsers', label: 'Registered Patients', icon: UsersIcon, color: 'text-blue-500' },
  { key: 'totalInstant', label: 'Instant Bookings', icon: ZapIcon, color: 'text-orange-500' },
] as const

const financialStats = [
  { key: 'revenue', label: 'Revenue', icon: IndianRupeeIcon, color: 'text-green-600', format: (val: number) => `₹${val.toLocaleString('en-IN')}` },
  { key: 'totalOnline', label: 'Online Payments', icon: WifiIcon, color: 'text-purple-500' },
  { key: 'totalCOD', label: 'COD Payments', icon: CreditCardIcon, color: 'text-amber-600' },
  { key: 'totalRefunds', label: 'Refunds', icon: RefreshCcwIcon, color: 'text-red-500' },
] as const

export function OperationalCards({ timeRange, selectedMetric, onSelectMetric, userRole = 'USER' }: { timeRange: string, selectedMetric: string, onSelectMetric: (m: string) => void, userRole?: string }) {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.admin.stats.queryOptions({ timeRange: timeRange as any }))

  const actions = []
  if (userRole === 'PHLEBOTOMIST') {
    if ((data as any).pendingSamples > 0) actions.push(`${(data as any).pendingSamples} sample${(data as any).pendingSamples > 1 ? 's' : ''} to collect`)
  } else if (userRole === 'COO') {
    if ((data as any).pendingReports > 0) actions.push(`${(data as any).pendingReports} report${(data as any).pendingReports > 1 ? 's' : ''} to upload`)
  } else if (userRole === 'SUPER_ADMIN') {
    if ((data as any).unassignedBookings > 0) actions.push(`${(data as any).unassignedBookings} unassigned booking${(data as any).unassignedBookings > 1 ? 's' : ''}`)
  }

  return (
    <div className="flex flex-col gap-4">
      {actions.length > 0 && (
        <div className="mx-4 lg:mx-6 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3 text-amber-700 dark:text-amber-500">
            <AlertCircleIcon className="size-5 shrink-0 mt-0.5 sm:mt-0" />
            <div className="text-sm font-medium">
              <span className="font-bold uppercase tracking-wider mr-2 text-xs">Action Required:</span>
              You have {actions.join(', ')}.
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30 shrink-0 shadow-none" asChild>
            <Link to="/admin/bookings">
              Review Now
              <ArrowRightIcon className="ml-2 size-3.5" />
            </Link>
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 sm:grid-cols-2 lg:grid-cols-3 dark:*:data-[slot=card]:bg-card">
      {operationalStats.map(({ key, label, icon: Icon, color }) => (
        <Card 
          className={`@container/card cursor-pointer transition-colors ${selectedMetric === key ? 'ring-2 ring-primary bg-muted/20' : 'hover:bg-muted/10'}`} 
          key={key}
          onClick={() => onSelectMetric(key)}
        >
          <CardHeader className="p-4 xl:p-5">
            <CardDescription className="flex items-start sm:items-center gap-1.5 flex-wrap">
              <Icon className={`size-4 shrink-0 ${color}`} />
              <span className="font-medium min-w-0">{label}</span>
              <span className="sm:ml-auto flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                <TrendingUpIcon className="size-3" /> Live
              </span>
            </CardDescription>
            <CardTitle className="text-2xl xl:text-3xl font-medium tracking-tight">
              {(data as any)[key] || 0}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
      </div>
    </div>
  )
}

export function FinancialCards({ timeRange, selectedMetric, onSelectMetric }: { timeRange: string, selectedMetric: string, onSelectMetric: (m: string) => void }) {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.admin.stats.queryOptions({ timeRange: timeRange as any }))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
    {financialStats.map(({ key, label, icon: Icon, color, format }) => (
      <Card 
        className={`@container/card cursor-pointer transition-colors ${selectedMetric === key ? 'ring-2 ring-primary bg-muted/20' : 'hover:bg-muted/10'}`} 
        key={key}
        onClick={() => onSelectMetric(key)}
      >
        <CardHeader className="p-4 xl:p-5">
          <CardDescription className="flex items-start sm:items-center gap-1.5 flex-wrap">
            <Icon className={`size-4 shrink-0 ${color}`} />
            <span className="font-medium min-w-0">{label}</span>
          </CardDescription>
          <CardTitle className="text-2xl font-medium tracking-tight">
            {format ? format((data as any)[key] || 0) : ((data as any)[key] || 0)}
          </CardTitle>
        </CardHeader>
      </Card>
    ))}
    </div>
  )
}
