import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import type { ChartConfig } from '#/components/ui/chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '#/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { useIsMobile } from '#/hooks/use-mobile'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '#/components/ui/skeleton'

const chartConfig = {
  revenue: { label: 'Revenue (₹)', color: 'hsl(var(--chart-1))' },
  totalBookings: { label: 'Total Bookings', color: 'hsl(var(--chart-2))' },
  totalCompleted: { label: 'Completed Orders', color: 'hsl(var(--chart-3))' },
  totalPendingOrders: { label: 'Pending Orders', color: 'hsl(var(--chart-4))' },
  totalCancelled: { label: 'Cancelled Orders', color: 'hsl(var(--chart-5))' },
  totalUsers: { label: 'Registered Patients', color: 'hsl(var(--chart-1))' },
  totalInstant: { label: 'Instant Bookings', color: 'hsl(var(--chart-2))' },
  totalCOD: { label: 'COD Bookings', color: 'hsl(var(--chart-3))' },
  totalOnline: { label: 'Online Bookings', color: 'hsl(var(--chart-4))' },
  totalRefunds: { label: 'Refunds', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig

export function ChartAreaInteractive({ timeRange, selectedMetric, title = "Bookings Activity", description = "Real booking data for the selected period", mobileDescription = "Booking activity" }: { timeRange: string, selectedMetric: string, title?: string, description?: string, mobileDescription?: string }) {
  const trpc = useTRPC()
  const { data: chartData = [], isLoading } = useQuery(
    trpc.admin.bookingChartData.queryOptions({ timeRange: timeRange as any })
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {description}
          </span>
          <span className="@[540px]/card:hidden">{mobileDescription}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
            No booking data for this period.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-62.5 w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${selectedMetric})`} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={`var(--color-${selectedMetric})`} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey={selectedMetric}
                type="natural"
                fill="url(#fillMetric)"
                stroke={`var(--color-${selectedMetric})`}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
