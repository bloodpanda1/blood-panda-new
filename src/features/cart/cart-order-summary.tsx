import { Button } from '#/components/ui/button'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

import { Badge } from '#/components/ui/badge'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Separator } from '#/components/ui/separator'
import { formatCurrency } from '#/lib/utils'
import { useCart } from '#/stores/useCart'
import { CreditCard, Package, Shield, Trash2, Truck } from 'lucide-react'
import { useState } from 'react'
import { useSession } from '#/lib/auth-client'
import { useTRPC } from '#/integrations/trpc/react'
import { useQueryClient } from '@tanstack/react-query'

export default function CartOrderSummary() {
  const [couponCode, setCouponCode] = useState('PROMO30')

  const [isApplying, setIsApplying] = useState(false)
  const { data: session } = useSession()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { total, subtotal, coupon, applyCoupon, removeCoupon } = useCart()

  async function handleApplyCoupon() {
    if (couponCode.trim() === '') {
      toast.error('Please enter a valid coupon code.')
      return
    }

    if (!session) {
      toast.error('Please login to apply coupons.')
      return
    }

    setIsApplying(true)
    try {
      const res = await queryClient.fetchQuery(
        trpc.users.checkPromoEligibility.queryOptions({ code: couponCode })
      )
      if (res.isValid) {
        applyCoupon({ code: couponCode, discountPercentage: res.discountPercentage || 0 })
        toast.success(res.message)
      } else {
        toast.error(res.message)
        setCouponCode('')
      }
    } catch (e: any) {
      toast.error(e.message || 'Error validating promo code.')
      setCouponCode('')
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>
            Review your order details and shipping information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Applied/or not coupon code */}
          {coupon ? (
            <div className="flex items-center justify-between rounded-md border p-2">
              <span className="font-medium">{coupon.code}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  removeCoupon()
                  toast.success('Coupon removed successfully.')
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Promo Code</Label>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleApplyCoupon()
                }}
              >
                <Input
                  placeholder="Enter promo code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="outline">Apply</Button>
              </form>
            </div>
          )}

          {/* Order Summary */}
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(String(subtotal))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            {coupon && (
              <div className="flex justify-between text-sm">
                <span className={'inline-flex items-center gap-1'}>
                  Discount{' '}
                  <Badge className={'text-xs font-medium'}>{coupon.code}</Badge>
                </span>
                <span>
                  {' '}
                  -
                  {formatCurrency(
                    String(subtotal * (coupon.discountPercentage / 100)),
                  )}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(String(total))}</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-primary" />
              <span>Free returns within 30 days</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span>Cash on Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-primary" />
              <span>Fast delivery</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            asChild
            className={
              'w-full bg-destructive hover:bg-accent hover:text-destructive transition-all duration-300 ease-in-out'
            }
          >
            <Link to="/booking">
              <CreditCard className="mr-2 h-4 w-4" />
              Proceed to Checkout
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
