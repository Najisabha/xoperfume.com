import { CartItems } from "@/components/cart/cart-items"
import { CartSummary } from "@/components/cart/cart-summary"


export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang

  const title_en = 'Cart - XO Perfumes'
  const title_fr = 'Panier - XO Perfumes'
  const description_en = 'Review the items in your shopping cart at XO Perfumes.'
  const description_fr = 'Vérifiez les articles de votre panier d\'achat chez XO Perfumes.'

  return {
    title: lang === 'en' ? title_en : title_fr,
    description: lang === 'en' ? description_en : description_fr,
    openGraph: {
      title: lang === 'en' ? title_en : title_fr,
      description: lang === 'en' ? description_en : description_fr,
    },
    alternates: lang === 'en' ? {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/en/cart`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/cart`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/cart`,
    } : {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/cart`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/cart`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/cart`,
    },
  }
}

// export async function generateMetadata() {
//   const title = 'Shopping Cart - XO Perfumes'
//   const description = 'Review the items in your shopping cart at XO Perfumes.'
//   const url = 'https://www.graceleonard.com/cart'

//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//       url,
//       siteName: 'XO Perfumes',
//       type: 'website',
//     },
//     twitter: {
//       card: 'summary',
//       title,
//       description,
//       site: '@graceleonard',
//     },
//   }
// }

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <CartItems />
        <CartSummary />
      </div>
    </div>
  )
}