import "../globals.css"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import { Providers } from "@/components/providers"
import { Suspense } from "react"
import Footer from "@/components/footer"
import { i18n } from "@/lib/i18n-config"
import PasswordProtect from "@/components/PasswordProtect"
import { getDictionary } from "@/lib/get-dictionary"
import connectDB from "@/lib/db"
import { Category } from "@/lib/models/category"
import { Product } from "@/lib/models/product"
import Setting from "@/lib/models/setting"
import { Color } from "@/lib/models/color"
import { Almarai } from "next/font/google"

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
})

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang

  const title_en = 'XO Perfumes - Luxury Fragrances & Beauty'
  const title_ar = 'XO Perfumes - عطور فاخرة وجمال'
  const title_he = 'XO Perfumes - בשמי יוקרה וטיפוח'
  const description_en = 'Explore a curated collection of premium perfumes and beauty essentials for a timeless aura.'
  const description_ar = 'اكتشف مجموعة مختارة من العطور الفاخرة ومستلزمات الجمال المتميزة لإطلالة خالدة.'
  const description_he = 'גלו אוסף נבחר של בשמי יוקרה ומוצרי יופי מובחרים למראה על-זמני.'
  const keywords_en = 'perfumes, fragrances, beauty, makeup, luxury, elegant'
  const keywords_ar = 'عطور, جمال, مكياج, عطر, فخامة'
  const keywords_he = 'בשמים, יופי, איפור, בושם, יוקרה'

  const getTitle = (l: string) => {
    if (l === 'ar') return title_ar
    if (l === 'he') return title_he
    return title_en
  }

  const getDescription = (l: string) => {
    if (l === 'ar') return description_ar
    if (l === 'he') return description_he
    return description_en
  }

  const getKeywords = (l: string) => {
    if (l === 'ar') return keywords_ar
    if (l === 'he') return keywords_he
    return keywords_en
  }

  return {
    title: getTitle(lang),
    description: getDescription(lang),
    keywords: getKeywords(lang),
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL,
    openGraph: {
      type: "website",
      site_name: "XO Perfumes",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}`,
      title: getTitle(lang),
      description: getDescription(lang),
      locale: lang,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/assets/banners/men-perfume.png`,
          width: 1200,
          height: 630,
          alt: "XO Perfumes Men"
        },
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/assets/banners/women-perfume.png`,
          width: 1200,
          height: 630,
          alt: "XO Perfumes Women"
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: getTitle(lang),
      description: getDescription(lang),
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

  const dict = await getDictionary(lang)

  await connectDB()

  // Ensure Color is loaded for Mongoose to populate
  await Color.findOne().select('_id').lean().exec()

  const [categories, products, setting] = await Promise.all([
    Category.find({ parentId: null })
      .populate({
        path: 'subcategories',
        select: 'name name_ar name_he slug description _id'
      })
      .sort({ name: 1 })
      .lean(),
    Product.find()
      .populate('category')
      .populate('variants.color')
      .lean(),
    Setting.findOne({ key: 'header_ad' }).lean()
  ])

  // Serialize payload to pass safely to Client Component
  const serializableCategories = JSON.parse(JSON.stringify(categories))
  const serializableProducts = JSON.parse(JSON.stringify(products))

  let headerAdText = ''
  if (setting && setting.value) {
    headerAdText = (setting.value as any)[lang] || (setting.value as any)['en'] || ''
  }

  return (
    <html lang={lang} suppressHydrationWarning className={almarai.variable}>
      <body style={lang === 'ar' ? { fontFamily: 'var(--font-almarai)' } : undefined}>
        <Providers>
          <PasswordProtect>
            <Navbar
              lang={lang}
              dict={dict}
              categories={serializableCategories}
              products={serializableProducts}
              headerAd={headerAdText}
            />
            <main>
              <Suspense fallback={<div>Loading...</div>}>
                {children}
              </Suspense>
            </main>
            <Footer lang={lang} dict={dict} />
            <Toaster />
          </PasswordProtect>
        </Providers>
      </body>
    </html>
  )
}
