// src/app/api/payments/mpesa/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { initiateSTKPush, querySTKStatus } from '@/lib/mpesa'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const stkSchema = z.object({
  orderId: z.string(),
  phone:   z.string().regex(/^(07|01|2547|2541)\d{8}$/, 'Invalid Kenyan phone number'),
  amount:  z.number().positive(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body   = await req.json()
    const parsed = stkSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const { orderId, phone, amount } = parsed.data

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: { id: orderId, buyerId: session.user.id, paymentStatus: 'PENDING' },
    })
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    const result = await initiateSTKPush({ phone, amount, orderId })

    if (result.ResponseCode === '0') {
      // Store checkout request ID for callback matching
      await prisma.order.update({
        where: { id: orderId },
        data:  { mpesaRef: result.CheckoutRequestID },
      })
      return NextResponse.json({
        success: true,
        data: { checkoutRequestId: result.CheckoutRequestID, message: result.CustomerMessage },
      })
    }

    return NextResponse.json({ success: false, error: result.ResponseDescription }, { status: 400 })
  } catch (err: unknown) {
    console.error('[MPESA STK]', err)
    return NextResponse.json({ success: false, error: 'Payment initiation failed' }, { status: 500 })
  }
}

// ─── M-Pesa Callback ─────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body     = await req.json()
    const callback = body?.Body?.stkCallback
    if (!callback) return NextResponse.json({ success: true })

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = callback

    const order = await prisma.order.findFirst({
      where: { mpesaRef: CheckoutRequestID },
    })
    if (!order) return NextResponse.json({ success: true })

    if (ResultCode === 0) {
      const items: Array<{ Name: string; Value: string | number }> = CallbackMetadata?.Item || []
      const get = (name: string) => items.find((i) => i.Name === name)?.Value

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status:        'CONFIRMED',
          mpesaRef:      String(get('MpesaReceiptNumber') || CheckoutRequestID),
        },
      })
      await prisma.orderHistory.create({
        data: { orderId: order.id, status: 'CONFIRMED', note: `M-Pesa payment confirmed. Ref: ${get('MpesaReceiptNumber')}` },
      })
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data:  { paymentStatus: 'FAILED' },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[MPESA CALLBACK]', err)
    return NextResponse.json({ success: true }) // Always 200 to Safaricom
  }
}

// ─── Poll STK Status ─────────────────────────────
export async function GET(req: NextRequest) {
  const checkoutId = req.nextUrl.searchParams.get('checkoutId')
  if (!checkoutId) return NextResponse.json({ success: false, error: 'Missing checkoutId' }, { status: 400 })

  try {
    const result = await querySTKStatus(checkoutId)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Query failed' }, { status: 500 })
  }
}
