// src/app/api/payments/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

// Create payment intent
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { orderId } = await req.json()
  const order = await prisma.order.findFirst({
    where: { id: orderId, buyerId: session.user.id, paymentStatus: 'PENDING' },
  })
  if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })

  const intent = await stripe.paymentIntents.create({
    amount:   Math.round(order.total * 100),    // Stripe uses cents/fils
    currency: 'kes',
    metadata: { orderId, userId: session.user.id },
  })

  await prisma.order.update({
    where: { id: orderId },
    data:  { mpesaRef: intent.id },             // reuse field for payment ref
  })

  return NextResponse.json({ success: true, data: { clientSecret: intent.client_secret } })
}

// Stripe webhook
export async function PUT(req: NextRequest) {
  const sig  = req.headers.get('stripe-signature')!
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent  = event.data.object as Stripe.PaymentIntent
    const orderId = intent.metadata.orderId
    await prisma.order.update({
      where: { id: orderId },
      data:  { paymentStatus: 'PAID', status: 'CONFIRMED' },
    })
    await prisma.orderHistory.create({
      data: { orderId, status: 'CONFIRMED', note: `Stripe payment confirmed. Ref: ${intent.id}` },
    })
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent  = event.data.object as Stripe.PaymentIntent
    await prisma.order.update({
      where: { id: intent.metadata.orderId },
      data:  { paymentStatus: 'FAILED' },
    })
  }

  return NextResponse.json({ received: true })
}
