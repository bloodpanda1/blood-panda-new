import { createCashfreeOrder, fetchCashfreeOrder } from './src/integrations/cashfree/index'

async function run() {
  console.log('Testing Cashfree Sandbox Order Creation with provided credentials...')
  try {
    const order = await createCashfreeOrder({
      orderId: `TEST_BP_${Date.now().toString().slice(-8)}`,
      orderAmount: 199.00,
      orderCurrency: 'INR',
      customer: {
        customerId: 'test_user_1',
        customerName: 'Test Patient',
        customerEmail: 'test@bloodpanda.com',
        customerPhone: '9876543210',
      },
      returnUrl: 'http://localhost:3000/payment-success?order_id={order_id}',
      orderNote: 'Test Blood Test Sandbox Booking',
    })

    console.log('✅ Cashfree Sandbox Order Created Successfully!')
    console.log('Order ID:', order.order_id)
    console.log('Payment Session ID:', order.payment_session_id)
    console.log('Order Status:', order.order_status)

    console.log('\nFetching order details from Cashfree Sandbox...')
    const fetched = await fetchCashfreeOrder(order.order_id)
    console.log('✅ Fetched Order:', {
      orderId: fetched.order_id,
      amount: fetched.order_amount,
      status: fetched.order_status,
      currency: fetched.order_currency,
    })
  } catch (err: any) {
    console.error('❌ Error during Cashfree test:', err)
  }
}

run()
