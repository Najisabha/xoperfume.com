import React from 'react'
import WishlistPage from './wishlist'
import { Metadata } from 'next'
import { getDictionary } from '@/lib/get-dictionary'

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const dict = await getDictionary(lang)
  const c = dict.cart // Using cart for now or add wishlist specific metadata to dict

  // Actually I added wishlist to dict, let's use it
  const w = dict.wishlist

  return {
    title: w.title + ' - XO Perfumes',
    description: w.empty_desc,
    openGraph: {
      title: w.title + ' - XO Perfumes',
      description: w.empty_desc,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/wishlist`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/wishlist`,
        ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar/wishlist`,
        he: `${process.env.NEXT_PUBLIC_SITE_URL}/he/wishlist`,
      },
    },
  }
}


const Wishlist = async ({ params }: { params: any }) => {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const dict = await getDictionary(lang)

  return (
    <WishlistPage dict={dict} lang={lang} />
  )
}

export default Wishlist