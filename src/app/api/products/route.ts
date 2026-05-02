// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import type { ProductFilters } from '@/types'

export async function GET(req: NextRequest) {
  const s = req.nextUrl.searchParams
  const filters: ProductFilters = {
    category:  s.get('category')  || undefined,
    search:    s.get('search')    || undefined,
    county:    s.get('county')    || undefined,
    sort:      (s.get('sort') as ProductFilters['sort']) || 'newest',
    page:      parseInt(s.get('page')     || '1'),
    pageSize:  parseInt(s.get('pageSize') || '20'),
    minPrice:  s.get('minPrice')  ? parseFloat(s.get('minPrice')!) : undefined,
    maxPrice:  s.get('maxPrice')  ? parseFloat(s.get('maxPrice')!) : undefined,
    rating:    s.get('rating')    ? parseFloat(s.get('rating')!)   : undefined,
    isFlashDeal: s.get('flash') === '1',
    vendorId:  s.get('vendorId')  || undefined,
  }

  const where: Record<string, unknown> = {
    isActive:   true,
    isApproved: true,
  }

  if (filters.search) {
    where.OR = [
      { name:        { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }
  if (filters.category) where.category = { slug: filters.category }
  if (filters.county)   where.county   = { equals: filters.county, mode: 'insensitive' }
  if (filters.vendorId) where.vendorId = filters.vendorId
  if (filters.isFlashDeal) where.isFlashDeal = true
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
      ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
    }
  }
  if (filters.rating) where.rating = { gte: filters.rating }

  const sortMap: Record<string, object> = {
    newest:     { createdAt: 'desc' },
    popular:    { salesCount: 'desc' },
    rating:     { rating: 'desc' },
    price_asc:  { price: 'asc' },
    price_desc: { price: 'desc' },
  }
  const orderBy = sortMap[filters.sort || 'newest'] || { createdAt: 'desc' }

  const page     = Math.max(1, filters.page || 1)
  const pageSize = Math.min(50, filters.pageSize || 20)
  const skip     = (page - 1) * pageSize

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        vendor:   { select: { id: true, shopName: true, slug: true, logo: true, rating: true, isApproved: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: products,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  })
}

// ─── Create Product (Vendor) ──────────────────────
const createSchema = z.object({
  categoryId:   z.string(),
  name:         z.string().min(3).max(200),
  nameSwahili:  z.string().optional(),
  description:  z.string().optional(),
  images:       z.array(z.string().url()).min(1).max(8),
  price:        z.number().positive(),
  originalPrice:z.number().positive().optional(),
  stock:        z.number().int().min(0),
  unit:         z.string().default('piece'),
  minBulkQty:   z.number().int().positive().optional(),
  bulkPrice:    z.number().positive().optional(),
  county:       z.string().optional(),
  town:         z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const vendor = await prisma.vendor.findFirst({
    where: { userId: session.user.id, isApproved: true, isActive: true },
  })
  if (!vendor) return NextResponse.json({ success: false, error: 'Vendor account required' }, { status: 403 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })

  const d = parsed.data
  const slug = `${d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`

  const product = await prisma.product.create({
    data: { ...d, vendorId: vendor.id, slug, isApproved: false },
  })

  return NextResponse.json({ success: true, data: product }, { status: 201 })
}
