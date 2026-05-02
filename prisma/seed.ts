// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding SokoYetu database…')

  // ─── Admin User ────────────────────────────────
  const adminPw = await bcrypt.hash(process.env.ADMIN_SETUP_SECRET || 'Admin@1234', 12)
  const admin = await prisma.user.upsert({
    where:  { email: process.env.ADMIN_EMAIL || 'admin@sokoyetu.co.ke' },
    update: {},
    create: {
      email:        process.env.ADMIN_EMAIL || 'admin@sokoyetu.co.ke',
      name:         'SokoYetu Admin',
      passwordHash: adminPw,
      role:         'SUPER_ADMIN',
      isVerified:   true,
      idVerified:   true,
    },
  })
  console.log('✅ Admin created:', admin.email)

  // ─── Categories ────────────────────────────────
  const categories = [
    { name: 'Electronics',       nameSwahili: 'Vifaa vya Kielektroniki', slug: 'electronics',      icon: '📱' },
    { name: 'Fashion',           nameSwahili: 'Mavazi',                  slug: 'fashion',           icon: '👗' },
    { name: 'Food & Groceries',  nameSwahili: 'Chakula na Mboga',        slug: 'food',              icon: '🛒' },
    { name: 'Home & Garden',     nameSwahili: 'Nyumba na Bustani',       slug: 'home',              icon: '🏡' },
    { name: 'Health & Beauty',   nameSwahili: 'Afya na Uzuri',           slug: 'health',            icon: '💊' },
    { name: 'School Supplies',   nameSwahili: 'Vifaa vya Shule',         slug: 'school',            icon: '✏️' },
    { name: 'Building Materials',nameSwahili: 'Vifaa vya Ujenzi',        slug: 'building',          icon: '🏗️' },
    { name: 'Agriculture',       nameSwahili: 'Kilimo',                  slug: 'agriculture',       icon: '🌾' },
    { name: 'Vehicles & Parts',  nameSwahili: 'Magari na Vipande',       slug: 'vehicles',          icon: '🚗' },
    { name: 'Services',          nameSwahili: 'Huduma',                  slug: 'services',          icon: '🔧' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log(`✅ ${categories.length} categories seeded`)

  // ─── Platform Settings ─────────────────────────
  const settings = [
    { key: 'platform_commission',      value: '5' },
    { key: 'min_payout_amount',        value: '500' },
    { key: 'flash_deal_max_discount',  value: '70' },
    { key: 'bulk_tier_1_qty',          value: '50' },
    { key: 'bulk_tier_1_discount',     value: '10' },
    { key: 'bulk_tier_2_qty',          value: '100' },
    { key: 'bulk_tier_2_discount',     value: '20' },
    { key: 'bulk_tier_3_qty',          value: '500' },
    { key: 'bulk_tier_3_discount',     value: '30' },
    { key: 'maintenance_mode',         value: 'false' },
    { key: 'sms_enabled',              value: 'true' },
    { key: 'email_enabled',            value: 'true' },
    { key: 'language_sw_enabled',      value: 'true' },
    { key: 'new_vendor_auto_approve',  value: 'false' },
  ]

  for (const s of settings) {
    await prisma.setting.upsert({
      where:  { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }
  console.log(`✅ ${settings.length} platform settings seeded`)

  console.log('\n🎉 Seed complete!')
  console.log(`   Admin: ${admin.email}`)
  console.log(`   Password: ${process.env.ADMIN_SETUP_SECRET || 'Admin@1234'}`)
  console.log(`   ⚠️  Change the admin password immediately after first login!`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
