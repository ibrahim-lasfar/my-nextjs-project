import { MetadataRoute } from 'next'
import { getSetting } from '@/lib/actions/setting.actions'
import Product from '@/lib/db/models/product.model'
import { connectToDatabase } from '@/lib/db'

type SitemapEntry = {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

const STATIC_PAGES = [
  { path: '', priority: 1.0 },
  { path: '/search', priority: 0.8 },
  { path: '/cart', priority: 0.6 },
  { path: '/categories', priority: 0.8 },
  { path: '/blog', priority: 0.9 },
] as const

const DEFAULT_BASE_URL = 'https://hager-zon.vercel.app'

const getBaseUrl = (url?: string): string => {
  if (url) return url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return DEFAULT_BASE_URL
}

const createStaticRoutes = (baseUrl: string): SitemapEntry[] => {
  return STATIC_PAGES.map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Connect to database
    await connectToDatabase()

    // Get site settings
    const { site: { url } } = await getSetting()
    const baseUrl = getBaseUrl(url)

    // Get all published products
    const products = await Product.find({ 
      isPublished: true,
      deletedAt: { $exists: false } // Ensure we don't include soft-deleted products
    })
      .select('slug updatedAt')
      .lean()

    // Create product URLs
    const productUrls: SitemapEntry[] = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }))

    // Create static routes
    const staticRoutes = createStaticRoutes(baseUrl)

    // Combine and return all routes
    return [...staticRoutes, ...productUrls]

  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return fallback sitemap with just static routes
    const baseUrl = DEFAULT_BASE_URL
    return createStaticRoutes(baseUrl).map(route => ({
      ...route,
      // Lower priority for fallback routes
      priority: Math.max(route.priority - 0.2, 0),
    }))
  }
}

// Ensure sitemap is revalidated periodically
export const revalidate = 3600 // Revalidate every hour