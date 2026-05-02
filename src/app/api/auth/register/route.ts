// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  name:     z.string().min(2).max(100),
  email:    z.string().email().optional().or(z.literal('')),
  phone:    z.string().regex(/^(07|01|2547|2541)\d{8}$/).optional().or(z.literal('')),
  password: z.string().min(8),
  role:     z.enum(['BUYER', 'VENDOR']).default('BUYER'),
}).refine(d => d.email || d.phone, { message: 'Email or phone is required' })

export async function POST(req: NextRequest) {
  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message }, { status: 400 })
  }

  const { name, email, phone, password, role } = parsed.data

  // Check duplicate
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    },
  })
  if (existing) {
    const field = existing.email === email ? 'Email' : 'Phone number'
    return NextResponse.json({ success: false, error: `${field} is already registered` }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      name,
      email:        email || undefined,
      phone:        phone || undefined,
      passwordHash,
      role,
    },
    select: { id: true, name: true, email: true, role: true },
  })

  return NextResponse.json({ success: true, data: user }, { status: 201 })
}
