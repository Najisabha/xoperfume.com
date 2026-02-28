import "../globals.css"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import { Providers } from "@/components/providers"
import { Suspense } from "react"
import Footer from "@/components/footer"
import { i18n } from "@/lib/i18n-config"
import PasswordProtect from "@/components/PasswordProtect"

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang

  const title_en = 'XO Perfumes - Luxury Jewelry for Kids'
  const title_fr = 'XO Perfumes - Bijoux de Luxe pour Enfants'
  const description_en = 'Discover timeless elegance with XO Perfumes\'s luxury jewelry collection for children.'
  const description_fr = 'Découvrez l\'élégance intemporelle avec la collection de bijoux de luxe pour enfants de XO Perfumes.'
  const keywords_en = 'jewelry, kids, children, luxury, elegant, timeless'
  const keywords_fr = 'bijoux, enfants, luxe, élégant, intemporel'

  return {
    title: lang === 'en' ? title_en : title_fr,
    description: lang === 'en' ? description_en : description_fr,
    keywords: lang === 'en' ? keywords_en : keywords_fr,
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL,
    openGraph: {
      type: "website",
      site_name: "XO Perfumes",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}`,
      title: lang === 'en' ? title_en : title_fr,
      description: lang === 'en' ? description_en : description_fr,
      locale: lang,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: "XO Perfumes"
        },
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/assets/banners/Banner1.jpeg`,
          width: 1200,
          height: 630,
          alt: "XO Perfumes Banner"
        },
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/assets/banners/Banner2.jpeg`,
          width: 1200,
          height: 630,
          alt: "XO Perfumes Banner"
        },
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/assets/banners/Banner3.jpeg`,
          width: 1200,
          height: 630,
          alt: "XO Perfumes Banner"
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: lang === 'en' ? title_en : title_fr,
      description: lang === 'en' ? description_en : description_fr,
      images: [`${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.png`],
    }
  }
}
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({ children, params }: {
  children: React.ReactNode,
  params: any
}) {
  const resolvedParams = await params
  const lang = resolvedParams.lang

  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
        <Providers>
          <PasswordProtect>
            <Navbar lang={lang} />
            <main>
              <Suspense fallback={<div>Loading...</div>}>
                {children}
              </Suspense>
            </main>
            <Footer lang={lang} />
            <Toaster />
          </PasswordProtect>
        </Providers>
      </body>
    </html>
  )
}
