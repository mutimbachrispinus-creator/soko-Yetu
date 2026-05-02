// src/app/api/fraud/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  targetType:  z.enum(['PRODUCT', 'VENDOR', 'USER', 'ORDER']),
  targetId:    z.string(),
  category:    z.enum(['COUNTERFEIT','PAYMENT_SCAM','MISLEADING_LISTING','NO_DELIVERY','HARASSMENT','OTHER']),
  description: z.string().min(20, 'Please provide at least 20 characters of detail'),
  vendorRef:   z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'You must be signed in to report fraud' }, { status: 401 })
  }

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
  }

  const report = await prisma.fraudReport.create({
    data: { ...parsed.data, reporterId: session.user.id, status: 'OPEN' },
  })

  // Notify admins (in production, also send email/SMS)
  const admins = await prisma.user.findMany({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } } })
  await Promise.all(
    admins.map((a) =>
      prisma.notification.create({
        data: {
          userId: a.id,
          title:  '🚨 New Fraud Report',
          body:   `Category: ${parsed.data.category}. Reported by: ${session.user?.email}`,
          type:   'FRAUD_REPORT',
          link:   `/admin/fraud/${report.id}`,
        },
      })
    )
  )

  return NextResponse.json({ success: true, data: { id: report.id } }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as Record<string, string>)?.role
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const status = req.nextUrl.searchParams.get('status') || undefined
  const limit  = parseInt(req.nextUrl.searchParams.get('limit') || '50')

  const reports = await prisma.fraudReport.findMany({
    where:   status ? { status: status as 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED' } : undefined,
    orderBy: { createdAt: 'desc' },
    take:    limit,
    include: { reporter: { select: { name: true, email: true } } },
  })

  return NextResponse.json({ success: true, data: reports })
}
