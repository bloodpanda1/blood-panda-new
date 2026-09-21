import { createFileRoute, useParams } from '@tanstack/react-router'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import { PrinterIcon, ArrowLeftIcon, DropletIcon } from 'lucide-react'

export const Route = createFileRoute('/invoice/$bookingId')({
  component: InvoiceRouteComponent,
})

function InvoiceRouteComponent() {
  const { bookingId } = Route.useParams()
  const trpc = useTRPC()

  const { data: booking, isLoading, error } = useQuery(
    trpc.users.bookingById.queryOptions({ id: bookingId })
  )

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h2 className="text-2xl font-bold">Invoice Not Found</h2>
        <p className="text-muted-foreground">The requested invoice could not be found or you don't have access.</p>
        <Button onClick={() => window.close()}>Close Window</Button>
      </div>
    )
  }

  const primaryAddress = booking.addresses?.[0]
  const payment = booking.payments?.[0]

  const calculateSubtotal = () => {
    let sum = 0
    booking.members?.forEach((m: any) => {
      m.testItems?.forEach((t: any) => {
        sum += parseFloat(t.discountedPrice || t.originalPrice || '0')
      })
    })
    return sum
  }

  const subtotal = calculateSubtotal()
  
  // Basic invoice structure optimized for printing
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 sm:p-8">
      {/* Print Controls - Hidden when printing */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={() => window.history.back()} className="gap-2">
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>
        <Button onClick={() => window.print()} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <PrinterIcon className="size-4" />
          Print / Save PDF
        </Button>
      </div>

      {/* Invoice Document */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border shadow-lg print:shadow-none print:border-none p-8 sm:p-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b pb-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600">
              <DropletIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wider text-red-600 dark:text-red-500">
                BloodPanda
              </h1>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Diagnostics
              </p>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-0 text-left sm:text-right">
            <h2 className="text-3xl font-light text-gray-800 dark:text-gray-200 uppercase tracking-widest mb-2">Invoice</h2>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">#{booking.id.slice(0, 12).toUpperCase()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Date: {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Billed To</h3>
            <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">
              {booking.type === 'INSTANT_BOOKING' ? booking.fullName : booking.user?.name || 'Customer'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {booking.type === 'INSTANT_BOOKING' ? booking.mobileNumber : booking.user?.phone || ''}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {booking.type === 'INSTANT_BOOKING' ? '' : booking.user?.email || ''}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-[250px]">
              {primaryAddress?.location || booking.address || ''}
              <br />
              {[primaryAddress?.houseNo, primaryAddress?.landmark, primaryAddress?.pinCode].filter(Boolean).join(', ') || booking.city || ''}
            </p>
          </div>
          
          <div className="sm:text-right">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Payment Info</h3>
            <div className="inline-block text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Method:</span> <span className="uppercase">{booking.type?.replace('_', ' ')}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className="font-semibold">Status:</span> 
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {booking.paymentStatus}
                </span>
              </p>
              {payment?.merchantOrderId && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="font-semibold">Txn ID:</span> {payment.merchantOrderId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">Patient</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">Description</th>
                <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {booking.members?.flatMap((m: any) => 
                m.testItems?.map((t: any, idx: number) => (
                  <tr key={`${m.id}-${idx}`}>
                    <td className="py-4 px-4 text-sm font-medium text-gray-800 dark:text-gray-200 align-top">
                      {m.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 align-top">
                      {t.name}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-800 dark:text-gray-200 text-right align-top">
                      ₹{t.discountedPrice || t.originalPrice || '0'}
                    </td>
                  </tr>
                ))
              )}
              {(!booking.members || booking.members.length === 0) && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-sm text-gray-500">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-full sm:w-1/2 md:w-1/3">
            <div className="flex justify-between py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
              <span>Home Collection</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between py-4 text-lg font-bold text-gray-800 dark:text-gray-200">
              <span>Total</span>
              <span className="text-red-600 dark:text-red-500">₹{subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row justify-between text-sm text-gray-500">
          <p>
            <span className="font-bold text-gray-800 dark:text-gray-300">BloodPanda Diagnostics</span><br />
            Bengaluru, Karnataka, India<br />
            support@bloodpanda.com
          </p>
          <p className="mt-4 sm:mt-0 sm:text-right">
            This is a computer-generated invoice.<br />No signature is required.
          </p>
        </div>
      </div>
      
      {/* Auto-print script block */}
      <style>{`
        @media print {
          @page { margin: 0.5cm; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  )
}
