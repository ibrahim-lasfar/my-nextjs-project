import { MetadataRoute } from 'next'
import { getSetting } from '@/lib/actions/setting.actions'
import Product from '@/lib/db/models/product.model'
import { connectToDatabase } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectToDatabase()
  const { site: { url } } = await getSetting()
  
  // Get all products
  const products = await Product.find({ isPublished: true })
    .select('slug updatedAt')
    .lean()

  // Product URLs
  const productUrls = products.map((product) => ({
    url: `${url}/product/${product.slug}`,
    lastModified: product.updatedAt,
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
    url: `${url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  return [...routes, ...productUrls]
}