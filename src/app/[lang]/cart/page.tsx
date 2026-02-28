import { CartItems } from "@/components/cart/cart-items"
import { CartSummary } from "@/components/cart/cart-summary"
import { getDictionary } from "@/lib/get-dictionary"


export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const dict = await getDictionary(lang)
  const c = dict.cart

  return {
    title: c.metadata_title,
    description: c.metadata_description,
    openGraph: {
      title: c.metadata_title,
      description: c.metadata_description,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/cart`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/cart`,
        ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar/cart`,
        he: `${process.env.NEXT_PUBLIC_SITE_URL}/he/cart`,
      },
    },
  }
}

export default async function CartPage({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const dict = await getDictionary(lang)

  return (
    <div className="container mx-auto px-4 py-8" dir={lang === 'ar' || lang === 'he' ? 'rtl' : 'ltr'}>
      <h1 className="mb-8 text-3xl font-bold">{dict.cart.title}</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <CartItems dict={dict} lang={lang} />
        <CartSummary dict={dict} lang={lang} />
      </div>
    </div>
  )
}