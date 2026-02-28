import { SignInForm } from "@/components/auth/sign-in-form"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang

  const title_en = 'Sign In - XO Perfumes'
  const title_fr = 'Se Connecter - XO Perfumes'
  const description_en = 'Sign in to your XO Perfumes account to access your orders and account details.'
  const description_fr = 'Connectez-vous à votre compte XO Perfumes pour accéder à vos commandes et détails de compte.'

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

export default async function SignInPage({ params, searchParams }: { params: any, searchParams: any }) {
  const session = await getServerSession()
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const callbackUrl = resolvedSearchParams.callbackUrl
  const lang = resolvedParams.lang

  if (session) {
    redirect(`/${lang}`)
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <SignInForm callbackUrl={callbackUrl} />
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={`/${lang}/auth/register`}
            className="text-primary hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  )
}