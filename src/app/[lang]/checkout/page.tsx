import CheckoutPageClient from './CheckoutPageClient'

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang

  const title_en = 'Checkout - XO Perfumes'
  const title_fr = 'Paiement - XO Perfumes'
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/en/auth/signin`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/auth/signin`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/auth/signin`,
    } : {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/auth/signin`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/auth/signin`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/auth/signin`,
    },
  }
}

import { getDictionary } from '@/lib/get-dictionary'

const CheckoutPage = async ({ params }: { params: any }) => {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const dict = await getDictionary(lang)

  return (
    <CheckoutPageClient lang={lang} dict={dict} />
  )
}

export default CheckoutPage