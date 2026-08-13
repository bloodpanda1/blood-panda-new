import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { ScrollArea } from '#/components/ui/scroll-area'
import { formatCurrency } from '#/lib/utils'
import { useCart } from '#/stores/useCart'
import { IconTrash } from '@tabler/icons-react'
import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

export default function CartItemsSection() {
  const {
    items,

    updateQuantity,
    removeItem,

    clearCart,
  } = useCart()

  return (
    <div className="space-y-6 lg:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-semibold">Shopping Cart</h1>
          </CardTitle>
          <CardDescription>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your
              cart
            </p>
          </CardDescription>
          <CardAction>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                clearCart()
                toast.success('Cart cleared successfully.')
              }}
            >
              <IconTrash className={'size-4'} />
              Clear Cart
            </Button>
          </CardAction>
        </CardHeader>

        <ScrollArea className="h-96 w-full">
          <CardContent>
            <div className="space-y-4 py-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden p-0">
                  <CardContent className="p-0">
                    <div className="flex h-full flex-col md:flex-row">
                      {/* Product Image */}
                      <div className="relative h-auto w-full md:w-32 bg-destructive/10">
                        <img
                          // src={'https://avatar.vercel.sh/rauchg?size=30'}
                          src={'/packages/3.svg'}
                          alt={item.name}
                          width={300}
                          height={300}
                          className="h-full w-full object-cover md:w-32"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 p-6 pb-3">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            {/* <p className="text-sm text-muted-foreground">
                                {item.color} • {item.size}
                              </p> */}
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeItem({ id: item.id })}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity({
                                    id: item.id,
                                    quantity: item.quantity - 1,
                                  })
                                  toast.success(
                                    'Item quantity updated successfully.',
                                  )
                                  return
                                } else {
                                  return toast.warning(
                                    'You cannot have less than 1 item of the same product.',
                                  )
                                }
                              }}
                            >
                              <MinusIcon className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                if (item.quantity < 3) {
                                  updateQuantity({
                                    id: item.id,
                                    quantity: item.quantity + 1,
                                  })
                                  toast.success(
                                    'Item quantity updated successfully.',
                                  )
                                  return
                                } else {
                                  return toast.warning(
                                    'You cannot add more than 3 items of the same product.',
                                  )
                                }
                              }}
                            >
                              <PlusIcon className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="font-medium">
                              {/* ${(item.price * item.quantity).toFixed(2)} */}
                              {formatCurrency(
                                String(item.price * item.quantity),
                              )}
                            </div>
                            {/* {item.originalPrice && (
                                <div className="text-sm text-muted-foreground line-through">
                                  $
                                  {(item.originalPrice * item.quantity).toFixed(
                                    2
                                  )}
                                </div>
                              )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  )
}
