import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { ProfileTabs } from "@/components/profile/profile-tabs"

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang

  const title_en = 'Profile - XO Perfumes'
  const title_fr = 'Profil - XO Perfumes'
  const description_en = 'Review your account details and orders at XO Perfumes.'
  const description_fr = 'Consultez les détails de votre compte et vos commandes chez XO Perfumes.'

  return {
    title: lang === 'en' ? title_en : title_fr,
    description: lang === 'en' ? description_en : description_fr,
    openGraph: {
      title: lang === 'en' ? title_en : title_fr,
      description: lang === 'en' ? description_en : description_fr,
    },
    alternates: lang === 'en' ? {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/en/profile`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/profile`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/profile`,
    } : {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/profile`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/profile`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/profile`,
    },
  }
}

export default async function ProfilePage({ searchParams }: { searchParams: any }) {
  const session = await getServerSession(authConfig)

  const s_param = await searchParams
  const openTab = s_param.tab as string

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>
      <ProfileTabs openTab={openTab} />
    </div>
  )
}