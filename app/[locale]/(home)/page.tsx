import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { HomeCard } from '@/components/shared/home/home-card'
import { HomeCarousel } from '@/components/shared/home/home-carousel'
import ProductSlider from '@/components/shared/product/product-slider'
import { Card, CardContent } from '@/components/ui/card'

import {
  getProductsForCard,
  getProductsByTag,
  getLatestProducts,
} from '@/lib/actions/product.actions'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('Home')
  const { carousels } = await getSetting()
  const todaysDeals = await getProductsByTag({ tag: 'todays-deal' })
  const bestSellingProducts = await getProductsByTag({ tag: 'best-seller' })

  // Fetch the latest 4 products for Categories to explore
  const latestProducts = await getLatestProducts({ limit: 4 })
  const categories = latestProducts.map((product) => ({
    name: product.name,
    image: Array.isArray(product.images) && product.images.length > 0 
      ? product.images[0] 
      : '/images/fallback.jpg',
    href: `/product/${product.slug}`,
  }))

  const newArrivals = (await getProductsForCard({ tag: 'new-arrival' })).map((product) => ({
    ...product,
    name: product.name,
    image: Array.isArray(product.images) && product.images.length > 0 
      ? product.images[0] 
      : '/images/fallback.jpg',
    href: `/product/${product.slug}`,
  }))

  const featureds = (await getProductsForCard({ tag: 'featured' })).map((product) => ({
    ...product,
    name: product.name,
    image: Array.isArray(product.images) && product.images.length > 0 
      ? product.images[0] 
      : '/images/fallback.jpg',
    href: `/product/${product.slug}`,
  }))

  const bestSellers = (await getProductsForCard({ tag: 'best-seller' })).map((product) => ({
    ...product,
    name: product.name,
    image: Array.isArray(product.images) && product.images.length > 0 
      ? product.images[0] 
      : '/images/fallback.jpg',
    href: `/product/${product.slug}`,
  }))

  const cards = [
    {
      title: t('Categories to explore'),
      link: {
        text: t('See More'),
        href: '/search',
      },
      items: categories,
    },
    {
      title: t('Explore New Arrivals'),
      items: newArrivals,
      link: {
        text: t('View All'),
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: t('Discover Best Sellers'),
      items: bestSellers,
      link: {
        text: t('View All'),
        href: '/search?tag=best-seller',
      },
    },
    {
      title: t('Featured Products'),
      items: featureds,
      link: {
        text: t('Shop Now'),
        href: '/search?tag=featured',
      },
    },
  ]

  return (
    <>
      <HomeCarousel items={carousels} />
      <div className='md:p-4 md:space-y-4 bg-border'>
        <HomeCard cards={cards} />
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider title={t("Today's Deals")} products={todaysDeals} />
          </CardContent>
        </Card>
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider
              title={t('Best Selling Products')}
              products={bestSellingProducts}
              hideDetails
            />
          </CardContent>
        </Card>
      </div>

      <div className='p-4 bg-background'>
        <BrowsingHistoryList />
      </div>
    </>
  )
}