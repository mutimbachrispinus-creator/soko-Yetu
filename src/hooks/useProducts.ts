// src/hooks/useProducts.ts
import useSWR from 'swr'
import type { Product, PaginatedResponse, ProductFilters } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v))
  })
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    `/api/products?${params}`,
    fetcher,
    { revalidateOnFocus: false, keepPreviousData: true }
  )
  return { products: data?.data || [], total: data?.total || 0, totalPages: data?.totalPages || 0, isLoading, error, mutate }
}

export function useProduct(slug: string) {
  const { data, error, isLoading } = useSWR<{ success: boolean; data: Product }>(
    slug ? `/api/products/${slug}` : null,
    fetcher
  )
  return { product: data?.data, isLoading, error }
}

// src/hooks/useOrders.ts
import useSWR from 'swr'
import type { Order } from '@/types'

export function useOrders() {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: Order[] }>(
    '/api/orders',
    fetcher
  )
  return { orders: data?.data || [], isLoading, error, mutate }
}

export function useOrder(id: string) {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: Order }>(
    id ? `/api/orders/${id}` : null,
    fetcher
  )
  return { order: data?.data, isLoading, error, mutate }
}

// src/hooks/useAdmin.ts
import useSWR from 'swr'
import type { AdminStats } from '@/types'

export function useAdminStats() {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: AdminStats }>(
    '/api/admin',
    fetcher,
    { refreshInterval: 30000 } // refresh every 30s
  )
  return { stats: data?.data, isLoading, error, mutate }
}

export async function adminAction(action: string, targetId: string, data?: Record<string, unknown>) {
  const res = await fetch('/api/admin', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, targetId, data }),
  })
  return res.json()
}
