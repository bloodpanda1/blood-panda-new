import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/packages/')({
  loader: () => {
    throw redirect({ to: '/' })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return null
}
