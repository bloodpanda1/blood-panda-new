import { fetchCashfreeOrder } from './src/integrations/cashfree/index.ts'

async function checkOrder() {
  const orderId = 'BP_6e1c85100c8845ca_849470'
  try {
    const order = await fetchCashfreeOrder(orderId)
    console.log('Order Details:')
    console.log(JSON.stringify(order, null, 2))
  } catch (error: any) {
    console.error('Failed to fetch order:', error.message)
  }
}

checkOrder()
