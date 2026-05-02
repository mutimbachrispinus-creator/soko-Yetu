// src/app/api/admin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function isAdmin(role?: string) {
  return role === 'ADMIN' || role === 'SUPER_ADMIN'
}

// ─── GET: Dashboard Stats ─────────────────────────
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !isAdmin(session.user.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalUsers, totalVendors, pendingVendors,
    totalProducts, pendingProducts,
    totalOrders, todayOrders,
    revenueAll, revenueToday,
    openFraudReports, pendingPayouts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.vendor.count({ where: { isApproved: true } }),
    prisma.vendor.count({ where: { isApproved: false } }),
    prisma.product.count({ where: { isApproved: true } }),
    prisma.product.count({ where: { isApproved: false } }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID' } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID', createdAt: { gte: today } } }),
    prisma.fraudReport.count({ where: { status: 'OPEN' } }),
    prisma.payout.count({ where: { status: 'PENDING' } }),
  ])

  return NextResponse.json({
    success: true,
    data: {
      totalUsers, totalVendors, pendingVendors,
      totalProducts, pendingProducts,
      totalOrders, todayOrders,
      totalRevenue: revenueAll._sum.total || 0,
      todayRevenue: revenueToday._sum.total || 0,
      openFraudReports, pendingPayouts,
    },
  })
}

// ─── PATCH: Admin Actions ─────────────────────────
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !isAdmin(session.user.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const { action, targetId, data } = await req.json()

  switch (action) {
    case 'APPROVE_VENDOR': {
      await prisma.vendor.update({ where: { id: targetId }, data: { isApproved: true } })
      await prisma.notification.create({
        data: {
          userId: (await prisma.vendor.findUnique({ where: { id: targetId }, select: { userId: true } }))!.userId,
          title: '🎉 Shop Approved!',
          body:  'Your vendor application has been approved. You can now list products.',
          type:  'VENDOR_APPROVED',
          link:  '/vendor/dashboard',
        },
      })
      return NextResponse.json({ success: true })
    }

    case 'REJECT_VENDOR': {
      await prisma.vendor.update({ where: { id: targetId }, data: { isApproved: false, isActive: false } })
      return NextResponse.json({ success: true })
    }

    case 'APPROVE_PRODUCT': {
      await prisma.product.update({ where: { id: targetId }, data: { isApproved: true } })
      return NextResponse.json({ success: true })
    }

    case 'REJECT_PRODUCT': {
      await prisma.product.update({ where: { id: targetId }, data: { isApproved: false, isActive: false } })
      return NextResponse.json({ success: true })
    }

    case 'BAN_USER': {
      await prisma.user.update({
        where: { id: targetId },
        data:  { isBanned: true, banReason: data?.reason || 'Policy violation' },
      })
      return NextResponse.json({ success: true })
    }

    case 'UNBAN_USER': {
      await prisma.user.update({ where: { id: targetId }, data: { isBanned: false, banReason: null } })
      return NextResponse.json({ success: true })
    }

    case 'RESOLVE_FRAUD': {
      await prisma.fraudReport.update({
        where: { id: targetId },
        data:  { status: 'RESOLVED', adminNote: data?.note, resolvedAt: new Date() },
      })
      return NextResponse.json({ success: true })
    }

    case 'DISMISS_FRAUD': {
      await prisma.fraudReport.update({
        where: { id: targetId },
        data:  { status: 'DISMISSED', adminNote: data?.note },
      })
      return NextResponse.json({ success: true })
    }

    case 'PROCESS_PAYOUT': {
      await prisma.payout.update({
        where: { id: targetId },
        data:  { status: 'PAID', processedAt: new Date(), reference: data?.reference },
      })
      // Deduct from vendor balance
      const payout = await prisma.payout.findUnique({ where: { id: targetId } })
      if (payout) {
        await prisma.vendor.update({
          where: { id: payout.vendorId },
          data:  { balance: { decrement: payout.amount } },
        })
      }
      return NextResponse.json({ success: true })
    }

    case 'UPDATE_SETTING': {
      await prisma.setting.upsert({
        where:  { key: data.key },
        update: { value: data.value },
        create: { key: data.key, value: data.value },
      })
      return NextResponse.json({ success: true })
    }

    default:
      return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 })
  }
}
