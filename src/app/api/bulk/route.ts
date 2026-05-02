// src/app/api/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  product:         z.string().min(3),
  institutionName: z.string().min(3),
  quantity:        z.number().int().min(10),
  discountTier:    z.number().int().min(0).max(30),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Sign in to place a bulk order' }, { status: 401 })
  }

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
  }

  const request = await prisma.bulkRequest.create({
    data: { ...parsed.data, userId: session.user.id },
  })

  return NextResponse.json({ success: true, data: { id: request.id } }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as Record<string, string>)?.role
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const requests = await prisma.bulkRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true, phone: true } } },
  })

  return NextResponse.json({ success: true, data: requests })
}
