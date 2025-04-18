import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import ClientProviders from '@/components/shared/client-providers'
import { getDirection } from '@/i18n-config'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { getSetting } from '@/lib/actions/setting.actions'
import { cookies } from 'next/headers'
import { Metadata } from 'next'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateMetadata(): Promise<Metadata> {
  try {
    const {
      site: { slogan, name, description, url },
    } = await getSetting()
    
    return {
      title: {
        template: `%s | ${name}`,
        default: `${name}. ${slogan}`,
      },
      description,
      metadataBase: new URL(url || 'https://hager-zon.vercel.app/'),
      verification: {
        google: 'PQo-i3w5jhSFT2MCdZxg0HnFOHDQ-iYMLNg8rYeFtXM',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: url || 'https://hager-zon.vercel.app/',
        title: name,
        description,
        siteName: name,
      },
    }
  } catch (error) {
    // Fallback metadata if settings fetch fails
    return {
      title: 'MGZon E-commerce',
      description: 'Your ultimate shopping destination',
      verification: {
        google: 'PQo-i3w5jhSFT2MCdZxg0HnFOHDQ-iYMLNg8rYeFtXM',
      },
    }
  }
}

export default async function AppLayout({
  params,
  children,
}: {
  params: { locale: string }
  children: React.ReactNode
}) {
  const setting = await getSetting()
  const cookieStore = cookies()
  const currencyCookie = cookieStore.get('currency')
  const currency = currencyCookie ? currencyCookie.value : 'USD'

  const { locale } = params
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={getDirection(locale) === 'rtl' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders setting={{ ...setting, currency }}>
            {children}
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}