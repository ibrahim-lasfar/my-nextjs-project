import { MetadataRoute } from 'next'
import { getSetting } from '@/lib/actions/setting.actions'
import Product from '@/lib/db/models/product.model'
import { connectToDatabase } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectToDatabase()
    const { site: { url } } = await getSetting()
    const baseUrl = url || 'https://hager-zon.vercel.app/'
    
    // Get all products
    const products = await Product.find({ isPublished: true })
      .select('slug updatedAt')
      .lean()

    // Product URLs
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

    // Static pages
    const routes = [
      '',
      '/search',
      '/cart',
      '/categories',
      '/blog',
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    }))

    return [...routes, ...productUrls]
  } catch (error) {
    // Fallback sitemap with just static routes
    const baseUrl = 'https://hager-zon.vercel.app/'
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/search`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/cart`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ]
  }
}