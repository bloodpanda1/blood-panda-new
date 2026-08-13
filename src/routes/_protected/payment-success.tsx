import { seo } from '#/constants/seo-details'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/payment-success')({
  head: () => seo({ path: '/payment-success' }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/payment-success"!</div>
}
