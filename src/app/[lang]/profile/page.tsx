import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { getDictionary } from "@/lib/get-dictionary"

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const dict = await getDictionary(lang)
  const t = dict?.profile || {}

  const title = `${t.title || 'Profile'} - XO Perfumes`
  const description = 'Review your account details and orders at XO Perfumes.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/profile`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_SITE_URL}/en/profile`,
        'ar': `${process.env.NEXT_PUBLIC_SITE_URL}/ar/profile`,
        'he': `${process.env.NEXT_PUBLIC_SITE_URL}/he/profile`,
      }
    },
  }
}

export default async function ProfilePage({ params, searchParams }: any) {
  const session = await getServerSession(authConfig)
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const dict = await getDictionary(lang)
  const t = dict?.profile || {}

  const s_param = await searchParams
  const openTab = s_param.tab as string
  const isRtl = lang === 'ar' || lang === 'he'

  return (
    <div className="container mx-auto px-4 py-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <h1 className={`mb-8 text-3xl font-bold ${isRtl ? 'text-right' : 'text-left'}`}>
        {t.title || 'My Account'}
      </h1>
      <ProfileTabs openTab={openTab} lang={lang} dict={dict} />
    </div>
  )
}