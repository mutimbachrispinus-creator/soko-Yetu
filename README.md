# SokoYetu — Next.js Platform

Kenya's multi-vendor marketplace. Secure M-Pesa payments, KRA-verified vendors, PWA mobile app, Swahili/English, bulk orders for schools.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Radix UI |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth.js (Google + Credentials) |
| Realtime | Firebase Firestore |
| Images | Cloudinary |
| Payments | M-Pesa Daraja, Stripe, PesaPal |
| SMS | Africa's Talking |
| Email | Nodemailer / SendGrid |
| State | Zustand + SWR |
| PWA | next-pwa |
| Deploy | Vercel + Neon (Postgres) |

---

## Project Structure

```
sokoyetu-nextjs/
├── prisma/
│   ├── schema.prisma          # Full data model
│   └── seed.ts                # Sample data seeder
│
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # App icons (72–512px)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout + metadata
│   │   ├── globals.css
│   │   │
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/       # NextAuth handler
│   │   │   ├── products/                 # Product CRUD + filters
│   │   │   ├── orders/                   # Order management
│   │   │   ├── payments/
│   │   │   │   ├── mpesa/                # STK Push + callback
│   │   │   │   ├── stripe/               # Stripe checkout
│   │   │   │   └── card/
│   │   │   ├── fraud/                    # Fraud report submission
│   │   │   ├── bulk/                     # Bulk order requests
│   │   │   ├── vendors/                  # Vendor registration/management
│   │   │   ├── reviews/                  # Product reviews
│   │   │   ├── search/                   # Search + autocomplete
│   │   │   └── admin/                    # Admin actions (protected)
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/                    # Sign in page
│   │   │   └── register/                 # Sign up page
│   │   │
│   │   ├── (buyer)/
│   │   │   ├── cart/                     # Cart & checkout
│   │   │   ├── orders/                   # Order history
│   │   │   ├── profile/                  # Account settings
│   │   │   └── track/[orderId]/          # Live order tracking
│   │   │
│   │   ├── (vendor)/
│   │   │   ├── dashboard/                # Vendor home
│   │   │   ├── products/
│   │   │   │   ├── page.tsx              # Product list
│   │   │   │   ├── new/                  # New listing form
│   │   │   │   └── [id]/                 # Edit listing
│   │   │   ├── orders/                   # Incoming orders
│   │   │   ├── analytics/                # Sales charts
│   │   │   └── settings/                 # Shop settings
│   │   │
│   │   ├── (admin)/
│   │   │   ├── dashboard/                # Stats overview
│   │   │   ├── users/                    # User management
│   │   │   ├── vendors/                  # Vendor approvals
│   │   │   ├── products/                 # Product moderation
│   │   │   ├── orders/                   # All orders
│   │   │   ├── reports/                  # Financial reports
│   │   │   ├── fraud/                    # Fraud reports
│   │   │   ├── moderation/               # Content moderation queue
│   │   │   └── settings/                 # Platform settings
│   │   │
│   │   ├── products/[slug]/              # Product detail page
│   │   ├── bulk/                         # Bulk order page
│   │   └── search/                       # Search results page
│   │
│   ├── components/
│   │   ├── ui/                           # Reusable primitives (Button, Input, etc.)
│   │   ├── layout/                       # Header, Footer, Providers, Sidebar
│   │   ├── products/                     # ProductCard, ProductGrid, FilterBar
│   │   ├── auth/                         # LoginForm, RegisterForm, AuthGuard
│   │   ├── vendor/                       # VendorCard, VendorDashboard widgets
│   │   ├── admin/                        # AdminTable, StatCard, ModerationCard
│   │   ├── checkout/                     # Cart, MpesaForm, StripeForm
│   │   └── chat/                         # LiveChat widget
│   │
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   ├── useOrders.ts
│   │   └── useAdmin.ts
│   │
│   ├── lib/
│   │   ├── prisma.ts                     # Prisma singleton
│   │   ├── auth.ts                       # NextAuth config
│   │   ├── firebase/                     # Firebase client + admin
│   │   ├── mpesa/                        # Daraja STK Push
│   │   ├── stripe/                       # Stripe checkout sessions
│   │   └── email/                        # Nodemailer templates
│   │
│   ├── store/
│   │   └── index.ts                      # Zustand stores (cart, auth, UI, wishlist)
│   │
│   ├── types/
│   │   └── index.ts                      # All TypeScript interfaces
│   │
│   └── utils/
│       ├── format.ts                     # Currency, date formatters
│       ├── validators.ts                 # Zod schemas
│       └── slugify.ts
│
├── docs/
│   ├── ADMIN_MANUAL.md                   # Admin control manual
│   └── USER_MANUAL.md                    # Buyer + vendor manual
│
├── .env.example                          # Environment variable template
├── next.config.ts                        # Next.js + PWA config
├── tailwind.config.ts                    # Design tokens
├── package.json
└── README.md
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-org/sokoyetu.git
cd sokoyetu-nextjs
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

Key variables to fill in first:
- `DATABASE_URL` — PostgreSQL connection string (use [Neon](https://neon.tech) free tier)
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32` to generate
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from [Google Console](https://console.cloud.google.com)
- `MPESA_CONSUMER_KEY` / `MPESA_CONSUMER_SECRET` — from [Safaricom Daraja](https://developer.safaricom.co.ke)

### 3. Database Setup

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # (optional) Seed with sample data
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Create First Admin

After seeding, or manually in the database:

```sql
UPDATE "User" SET role = 'SUPER_ADMIN' WHERE email = 'your@email.com';
```

Then visit `http://localhost:3000/admin/dashboard`

---

## Deployment (Vercel)

```bash
npm install -g vercel
vercel --prod
```

Set all `.env.example` variables in your Vercel project dashboard under **Settings → Environment Variables**.

### M-Pesa Production Checklist
- [ ] Switch `MPESA_ENV` from `sandbox` to `production`
- [ ] Update `MPESA_CALLBACK_URL` to your live domain
- [ ] Get production credentials from Safaricom Go-Live process
- [ ] Test with a real KES 1 transaction first

---

## API Reference (Summary)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List products with filters |
| POST | `/api/products` | Vendor | Create new product |
| GET | `/api/products/[id]` | Public | Single product |
| PATCH | `/api/products/[id]` | Vendor/Admin | Update product |
| POST | `/api/orders` | Buyer | Place order |
| GET | `/api/orders` | Buyer | My orders |
| POST | `/api/payments/mpesa` | Buyer | Initiate STK Push |
| PUT | `/api/payments/mpesa` | System | M-Pesa callback |
| POST | `/api/payments/stripe` | Buyer | Stripe checkout session |
| POST | `/api/fraud` | Buyer | Submit fraud report |
| POST | `/api/bulk` | Buyer | Submit bulk order request |
| GET | `/api/admin` | Admin | Dashboard stats |
| PATCH | `/api/admin` | Admin | Admin actions |
| GET | `/api/vendors` | Public | List vendors |
| POST | `/api/vendors` | User | Apply as vendor |
| POST | `/api/reviews` | Buyer | Post review |

---

## Docs
- 📘 [Admin Manual](./docs/ADMIN_MANUAL.md)
- 📗 [User Manual](./docs/USER_MANUAL.md)
- 🌐 Live: [sokoyetu.co.ke](https://sokoyetu.co.ke)

---

*Built with ❤️ in Kenya 🇰🇪*
