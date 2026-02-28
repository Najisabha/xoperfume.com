import Link from "next/link"
import { Mail, Phone, Clock } from "lucide-react"
import { ContactForm } from "@/components/contact-form"

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang

  const title_en = 'Contact us - XO Perfumes'
  const title_fr = 'Contactez-nous - XO Perfumes'
  const description_en = 'Got a question? Contact XO Perfumes for assistance.'
  const description_fr = 'Vous avez une question? Contactez XO Perfumes pour obtenir de l\'aide.'

  return {
    title: lang === 'en' ? title_en : title_fr,
    description: lang === 'en' ? description_en : description_fr,
    openGraph: {
      title: lang === 'en' ? title_en : title_fr,
      description: lang === 'en' ? description_en : description_fr,
    },
    alternates: lang === 'en' ? {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/en/contact`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/contact`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/contact`,
    } : {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/contact`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/contact`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/contact`,
    },
  }
}

export default async function ContactUsPage({ params }: any) {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-12 text-center text-4xl font-bold">Got a question?</h1>
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-8 rounded-lg border bg-card p-8">
            <Link
              href={`/${lang}/faq`}
              className="block text-lg text-primary hover:underline"
            >
              Visit our FAQ page
            </Link>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <Link
                  href="mailto:info@xo-perfumes.com"
                  className="text-lg hover:underline"
                >
                  info@xo-perfumes.com
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <Link
                  href="https://wa.me/971568101611"
                  className="text-lg hover:underline"
                >
                  +91111111111
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-lg">
                  Monday-Friday, 0800am-1700pm
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-lg border bg-card p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}