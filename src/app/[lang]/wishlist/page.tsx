import React from 'react'
import WishlistPage from './wishlist'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang

  const title_en = 'Wishtlist - XO Perfumes'
  const title_fr = 'Liste de souhaits - XO Perfumes'
  const description_en = 'Review the items in your wishlist at XO Perfumes.'
  const description_fr = 'Vérifiez les articles de votre liste de souhaits chez XO Perfumes.'

  return {
    title: lang === 'en' ? title_en : title_fr,
    description: lang === 'en' ? description_en : description_fr,
    openGraph: {
      title: lang === 'en' ? title_en : title_fr,
      description: lang === 'en' ? description_en : description_fr,
    },
    alternates: lang === 'en' ? {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/en/wishlist`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/wishlist`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/wishlist`,
    } : {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/wishlist`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/wishlist`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/wishlist`,
    },
  }
}


const Wishlist = () => {
  return (
    <WishlistPage />
  )
}

export default Wishlist