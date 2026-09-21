import { BellIcon, CheckIcon } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { useTRPC } from '#/integrations/trpc/react'
import { ScrollArea } from '#/components/ui/scroll-area'
import { Link } from '@tanstack/react-router'
import { cn } from '#/lib/utils'

export function AdminNotifications() {
  const trpc = useTRPC()
  const { data: notifications, refetch } = useQuery({
    ...trpc.admin.adminNotifications.queryOptions(),
    refetchInterval: 30000 // Poll every 30s
  })
  const markRead = useMutation({
    ...trpc.admin.markAdminNotificationRead.mutationOptions(),
    onSuccess: () => refetch()
  })

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="size-8 relative"
          variant="outline"
        >
          <BellIcon className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {unreadCount} unread
            </span>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications?.length ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex flex-col gap-1 p-4 border-b text-sm transition-colors hover:bg-muted/50 relative group",
                    !notification.isRead && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1 pr-6">
                      <span className="font-semibold text-foreground/90">
                        {notification.title}
                      </span>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {notification.message}
                      </p>
                      <span className="text-[10px] text-muted-foreground/70 font-medium mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {!notification.isRead && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-6 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          markRead.mutate({ id: notification.id })
                        }}
                        title="Mark as read"
                      >
                        <CheckIcon className="size-3.5 text-primary" />
                      </Button>
                    )}
                  </div>
                  {notification.link && (
                    <Link
                      to={notification.link}
                      className="text-xs text-primary font-medium hover:underline mt-1 inline-block"
                      onClick={() => markRead.mutate({ id: notification.id })}
                    >
                      View details &rarr;
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full text-muted-foreground">
              <BellIcon className="size-8 opacity-20 mb-3" />
              <p className="text-sm">No notifications yet</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
