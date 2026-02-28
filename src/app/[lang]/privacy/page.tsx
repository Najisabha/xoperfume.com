import Link from "next/link"

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang

  const title_en = 'Privacy Policy - XO Perfumes'
  const title_fr = 'Politique de Confidentialité - XO Perfumes'
  const description_en = 'Learn how we collect, use, and protect your personal information at XO Perfumes.'
  const description_fr = 'Découvrez comment nous collectons, utilisons et protégeons vos informations personnelles chez XO Perfumes.'

  return {
    title: lang === 'en' ? title_en : title_fr,
    description: lang === 'en' ? description_en : description_fr,
    openGraph: {
      title: lang === 'en' ? title_en : title_fr,
      description: lang === 'en' ? description_en : description_fr,
    },
    alternates: lang === 'en' ? {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/en/privacy`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/privacy`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/privacy`,
    } : {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/privacy`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/privacy`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/privacy`,
    },
  }
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-4xl font-bold">Privacy Policy</h1>
      <div className="prose prose-sm">
        <p>
          Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website or make a purchase.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We may collect personal information such as your name, email address, billing and shipping address, and payment details when you place an order or register an account.
        </p>
        <h2>How We Use Your Information</h2>
        <p>
          The information we collect is used to process transactions, provide customer support, and improve your shopping experience.
        </p>
        <h2>Data Security</h2>
        <p>
          We implement security measures to protect your personal information from unauthorized access or disclosure.
        </p>
        <h2>Cookies</h2>
        <p>
          Our website uses cookies to enhance user experience. You can choose to disable cookies through your browser settings.
        </p>
        <h2>Contact us</h2>
        <p>
          If you have any questions about our Privacy Policy, please contact us at <Link href="mailto:privacy@graceleonard.com">privacy@graceleonard.com</Link>.
        </p>
        <p>
          Please refer to our full Privacy Policy document for detailed information.
        </p>
      </div>
    </div>
  )
}