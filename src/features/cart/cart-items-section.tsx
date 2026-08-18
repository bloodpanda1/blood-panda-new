import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
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

        <div className="max-h-[60vh] sm:max-h-[70vh] w-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400/50 scrollbar-track-transparent pr-2">
          <CardContent>
            <div className="space-y-4 py-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden p-0">
                  <CardContent className="p-0">
                    <div className="flex h-full flex-row">
                      {/* Product Image */}
                      <div className="relative w-24 sm:w-32 shrink-0 bg-destructive/10">
                        <img
                          // src={'https://avatar.vercel.sh/rauchg?size=30'}
                          src={'/packages/3.svg'}
                          alt={item.name}
                          width={300}
                          height={300}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 p-3 sm:p-6 sm:pb-3 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-medium text-sm sm:text-base line-clamp-2">{item.name}</h3>
                            {/* <p className="text-sm text-muted-foreground">
                                {item.color} • {item.size}
                              </p> */}
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 shrink-0"
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
                              className="h-7 w-7 sm:h-9 sm:w-9 shrink-0"
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
                            <span className="w-6 sm:w-8 text-center text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-9 sm:w-9 shrink-0"
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

                          <div className="text-right pl-2">
                            <div className="font-medium text-sm sm:text-base">
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
        </div>
      </Card>
    </div>
  )
}
