// src/types/index.ts
// ─────────────────────────────────────────────────
// Central type definitions for SokoYetu
// ─────────────────────────────────────────────────

export type Role = 'BUYER' | 'VENDOR' | 'ADMIN' | 'SUPER_ADMIN'
export type Language = 'EN' | 'SW'
export type OrderStatus =
  | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED'
  | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' | 'DISPUTED'
export type PaymentMethod = 'MPESA' | 'STRIPE' | 'PAYPAL' | 'PESAPAL' | 'VISA' | 'MASTERCARD' | 'COD'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIAL'
export type FraudCategory = 'COUNTERFEIT' | 'PAYMENT_SCAM' | 'MISLEADING_LISTING' | 'NO_DELIVERY' | 'HARASSMENT' | 'OTHER'
export type ReportStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED'

// ─── User ─────────────────────────────────────────
export interface User {
  id: string
  email: string
  phone?: string
  name: string
  role: Role
  avatar?: string
  isVerified: boolean
  idVerified: boolean
  language: Language
  createdAt: string
  isBanned: boolean
  vendor?: Vendor
}

export interface AuthUser extends User {
  token?: string
}

// ─── Vendor ──────────────────────────────────────
export interface Vendor {
  id: string
  userId: string
  shopName: string
  slug: string
  description?: string
  logo?: string
  banner?: string
  county?: string
  town?: string
  isApproved: boolean
  isActive: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
  totalSales: number
  balance: number
  createdAt: string
  user?: Pick<User, 'name' | 'email' | 'phone' | 'avatar'>
}

// ─── Category ────────────────────────────────────
export interface Category {
  id: string
  name: string
  nameSwahili?: string
  slug: string
  icon?: string
  parentId?: string
  children?: Category[]
}

// ─── Product ─────────────────────────────────────
export interface Product {
  id: string
  vendorId: string
  categoryId: string
  name: string
  nameSwahili?: string
  slug: string
  description?: string
  images: string[]
  price: number
  originalPrice?: number
  stock: number
  unit: string
  minBulkQty?: number
  bulkPrice?: number
  isFeatured: boolean
  isFlashDeal: boolean
  flashDiscount?: number
  flashEndsAt?: string
  county?: string
  town?: string
  rating: number
  reviewCount: number
  salesCount: number
  createdAt: string
  vendor?: Pick<Vendor, 'id' | 'shopName' | 'slug' | 'logo' | 'rating' | 'isApproved'>
  category?: Pick<Category, 'id' | 'name' | 'slug'>
}

// ─── Cart ─────────────────────────────────────────
export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
}

// ─── Order ───────────────────────────────────────
export interface Order {
  id: string
  buyerId: string
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  mpesaRef?: string
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  isBulk: boolean
  institutionName?: string
  trackingCode?: string
  deliveryPartner?: string
  createdAt: string
  deliveredAt?: string
  items: OrderItem[]
  buyer?: Pick<User, 'name' | 'phone' | 'email'>
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  vendorId: string
  quantity: number
  unitPrice: number
  total: number
  status: OrderStatus
  product?: Pick<Product, 'name' | 'images' | 'slug'>
  vendor?: Pick<Vendor, 'shopName' | 'slug'>
}

// ─── Review ──────────────────────────────────────
export interface Review {
  id: string
  productId: string
  userId: string
  rating: number
  title?: string
  body?: string
  images: string[]
  isVerified: boolean
  createdAt: string
  user?: Pick<User, 'name' | 'avatar'>
}

// ─── Address ─────────────────────────────────────
export interface Address {
  id: string
  userId: string
  label: string
  name: string
  phone: string
  county: string
  town: string
  street?: string
  postalCode?: string
  isDefault: boolean
}

// ─── Fraud Report ────────────────────────────────
export interface FraudReport {
  id: string
  reporterId: string
  targetType: string
  targetId: string
  category: FraudCategory
  description: string
  vendorRef?: string
  status: ReportStatus
  adminNote?: string
  createdAt: string
  reporter?: Pick<User, 'name' | 'email'>
}

// ─── Bulk Request ────────────────────────────────
export interface BulkRequest {
  id: string
  userId: string
  product: string
  institutionName: string
  quantity: number
  discountTier: number
  status: string
  adminNote?: string
  createdAt: string
  user?: Pick<User, 'name' | 'email' | 'phone'>
}

// ─── Admin Dashboard ─────────────────────────────
export interface AdminStats {
  totalUsers: number
  totalVendors: number
  pendingVendors: number
  totalProducts: number
  pendingProducts: number
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  todayRevenue: number
  openFraudReports: number
  pendingPayouts: number
}

// ─── Notification ────────────────────────────────
export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  type: string
  isRead: boolean
  link?: string
  createdAt: string
}

// ─── M-Pesa ──────────────────────────────────────
export interface MpesaSTKResponse {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

export interface MpesaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string
      CheckoutRequestID: string
      ResultCode: number
      ResultDesc: string
      CallbackMetadata?: {
        Item: Array<{ Name: string; Value: string | number }>
      }
    }
  }
}

// ─── API Responses ───────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ─── Filter State ────────────────────────────────
export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  county?: string
  rating?: number
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular'
  search?: string
  page?: number
  pageSize?: number
  isFlashDeal?: boolean
  vendorId?: string
}
