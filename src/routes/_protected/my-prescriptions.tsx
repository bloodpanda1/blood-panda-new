import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { Skeleton } from '#/components/ui/skeleton'
import { seo } from '#/constants/seo-details'
import DeleteUserPrescriptionDialog from '#/features/profile/delete-user-prescription-dialog'
import UploadUserPrescriptionDialog from '#/features/profile/upload-user-prescription-dialog'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, FileTextIcon, PlusIcon } from 'lucide-react'

export const Route = createFileRoute('/_protected/my-prescriptions')({
  head: () => seo({ path: '/my-prescriptions' }),
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { data: prescriptions = [], isLoading } = useQuery(
    trpc.users.getPrescriptions.queryOptions()
  )

  return (
    <main className="mx-auto max-w-(--breakpoint-xl) space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/profile" className="hover:underline flex items-center gap-1">
              <ArrowLeftIcon className="size-4" />
              Profile
            </Link>
            <span>/</span>
            <span>Uploaded Prescriptions</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Uploaded Prescriptions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage your attached doctor prescriptions and diagnostic test recommendations.
          </p>
        </div>

        <UploadUserPrescriptionDialog />
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Prescriptions ({prescriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-md" />
              ))}
            </div>
          ) : prescriptions.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {prescriptions.map((presc: any, index: number) => (
                <div
                  key={index}
                  className="group relative aspect-square border rounded-lg overflow-hidden bg-muted/20 hover:border-primary/50 transition-all shadow-xs flex flex-col"
                >
                  <a
                    href={presc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 block w-full relative overflow-hidden"
                    title="Click to view full prescription"
                  >
                    {presc.url.endsWith('.pdf') ? (
                      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                        <FileTextIcon className="size-10 text-primary/70 mb-2" />
                        <span className="font-semibold text-sm">PDF Document</span>
                        <span className="text-xs text-muted-foreground mt-1">Prescription {index + 1}</span>
                      </div>
                    ) : (
                      <img
                        src={presc.url}
                        alt={`Prescription ${index + 1}`}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                      />
                    )}
                  </a>
                  {(presc.memberName || presc.doctorName) && (
                    <div className="bg-muted p-2 text-center text-xs font-medium border-t">
                      {presc.memberName && <div className="truncate">{presc.memberName}</div>}
                      {presc.doctorName && <div className="truncate text-muted-foreground mt-0.5 text-[10px]">Dr. {presc.doctorName.replace(/^Dr\.\s*/i, '')}</div>}
                    </div>
                  )}

                  {/* Delete Button overlay */}
                  <div className="absolute top-2 right-2 z-10 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <DeleteUserPrescriptionDialog url={presc.url} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                <FileTextIcon className="size-7 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">No prescriptions uploaded</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Upload your doctor prescription to get personalized diagnostic package recommendations.
                </p>
              </div>
              <UploadUserPrescriptionDialog />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
