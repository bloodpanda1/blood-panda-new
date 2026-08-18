// useCart.ts

import { useSelector } from "@xstate/store-react"
import { cartStore } from "./cart-store"

import { toast } from "sonner"

export function useCart() {
  const cart = useSelector(cartStore, (state) => state.context)

  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const discount = cart.coupon
    ? subtotal * (cart.coupon.discountPercentage / 100)
    : 0

  const total = subtotal - discount

  const addItem = (event: { item: { id: string; name: string; price: number; quantity?: number; image?: string } }) => {
    cartStore.trigger.addItem(event)
    toast.success(`${event.item.name} added to cart!`)
  }

  return {
    ...cart,

    subtotal,
    discount,
    total,

    addItem,
    removeItem: cartStore.trigger.removeItem,
    updateQuantity: cartStore.trigger.updateQuantity,

    applyCoupon: cartStore.trigger.applyCoupon,

    removeCoupon: cartStore.trigger.removeCoupon,

    clearCart: cartStore.trigger.clearCart,

    undo: cartStore.trigger.undo,
    redo: cartStore.trigger.redo,

    reset: cartStore.trigger.reset,
  }
}
