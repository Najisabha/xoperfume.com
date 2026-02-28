import { SignUpForm } from "@/components/auth/sign-up-form"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang

  const title_en = 'Register - XO Perfumes'
  const title_fr = 'S\'inscrire - XO Perfumes'
  const description_en = 'Create an account with XO Perfumes to access your orders and account details.'
  const description_fr = 'Créez un compte avec XO Perfumes pour accéder à vos commandes et détails de compte.'

  return {
    title: lang === 'en' ? title_en : title_fr,
    description: lang === 'en' ? description_en : description_fr,
    openGraph: {
      title: lang === 'en' ? title_en : title_fr,
      description: lang === 'en' ? description_en : description_fr,
    },
    alternates: lang === 'en' ? {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/en/auth/register`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/auth/register`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/auth/register`,
    } : {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/auth/register`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/auth/register`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/auth/register`,
    },
  }
}


export default async function RegisterPage({ params }: any) {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const session = await getServerSession()

  if (session) {
    redirect(`/${lang}`)
  }

  return (
    <div className="container relative flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to create your account
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}