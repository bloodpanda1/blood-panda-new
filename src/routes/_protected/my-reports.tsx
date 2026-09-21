import { createFileRoute } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardContent } from '#/components/ui/card'

export const Route = createFileRoute('/_protected/my-reports')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="mx-auto max-w-(--breakpoint-xl) space-y-8 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">No reports found.</p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
