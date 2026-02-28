import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang

  const title_en = 'Frequently Asked Questions - XO Perfumes'
  const title_fr = 'Questions Fréquemment Posées - XO Perfumes'
  const description_en = 'Find answers to common questions about our jewelry, shipping, returns, and more.'
  const description_fr = 'Trouvez des réponses aux questions courantes sur nos bijoux, l\'expédition, les retours et plus encore.'

  return {
    title: lang === 'en' ? title_en : title_fr,
    description: lang === 'en' ? description_en : description_fr,
    openGraph: {
      title: lang === 'en' ? title_en : title_fr,
      description: lang === 'en' ? description_en : description_fr,
    },
    alternates: lang === 'en' ? {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/en/faq`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/faq`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/faq`,
    } : {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/faq`,
      fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/faq`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/faq`,
    },
  }
}

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Find answers to common questions about our jewelry, shipping, returns, and more.
            Can&apos;t find what you&apos;re looking for? Contact our support team.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="grid gap-8">
            {FAQ_CATEGORIES.map((category) => (
              <div key={category.title} className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-2xl font-semibold text-primary">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const FAQ_CATEGORIES = [
  {
    title: "Sizing & Specifications",
    questions: [
      {
        question: "How can I get the correct-sized jewellery for my child?",
        answer: `Necklaces- All of our necklaces* measure 38cm at full length, and they can also be fastened close at 34cm and 36cm, to offer flexible sizing as your child grows.
        
        *Excluding the Whistle Necklace
        
        Bracelets- All of our bracelets measure 17cm at full length, and they can also be fastened close at 13cm and 15cm, to offer flexible sizing as your child grows.
        
        To help you visualise the size of our bracelets, please use the Wrist Size Guide.
        
        Every wrist size is different, in case ours doesn't fit your child, you can go to any jeweller to adjust it for you.
        
        For further customization, you can connect with us at info@xoperfumes.com`,
      },
      {
        question: "What is the appropriate age to gift gold to my child?",
        answer: "The XO Perfumes collection brings you pieces from young baby through to tween (young teen). Depending on the age of your child, we kindly ask families to use due diligence with small parts. During active play, for sports and sleeping, we advise families to remove jewellery temporarily for the child's safety and to prevent jewellery wear and tear.",
      },
    ],
  },
  {
    title: "Materials & Care",
    questions: [
      {
        question: "Are the items gold?",
        answer: "Yes, all are items are made with 18 Karat yellow, rose and white gold.",
      },
      {
        question: "Where do you source your gold?",
        answer: "We are committed to ethical sourcing practices. Our gold is a gift from the earth.",
      },
      {
        question: "What is Enamel?",
        answer: "Enamel is a beautiful material used to create colourful and decorative accents on some of our jewellery.",
      },
      {
        question: "What stones do you use in the jewellery?",
        answer: "We use diamonds. Size and carat vary depending on the item.",
      },
      {
        question: "How do I take care of my jewellery?",
        answer: "Be mindful when exposing jewellery to substances or situations that may cause damage. Remove jewellery in extreme heat and cold; at the beach; during rigorous physical activity and when applying lotions. Remove jewellery at night for safety and to prevent wear and tear.",
      },
    ],
  },
  {
    title: "Orders & Customization",
    questions: [
      {
        question: "Do you do gift wrapping?",
        answer: "Each piece is lovingly wrapped in our gift box, jewellery pouch and a colourful gift bag. It also includes care instructions. For any other wrapping request, please contact info@xoperfumes.com together with your order number.",
      },
      {
        question: "Can you personalise items?",
        answer: "Yes. We can even create a bespoke design. Please contact info@xoperfumes.com for a consultation and pricing.",
      },
    ],
  },
  {
    title: "Shipping & Location",
    questions: [
      {
        question: "Where is XO Perfumes located?",
        answer: "We are located in the United Arab Emirates and have French heritage.",
      },
      {
        question: "Is shipping free?",
        answer: "We offer complimentary shipping on all orders within the United Arab Emirates. For shipping outside of the UAE, please see our worldwide delivery options.",
      },
      {
        question: "Are your items tax-free?",
        answer: "UAE tax is already included in the price.",
      },
      {
        question: "Do you deliver worldwide?",
        answer: "Yes. Prices may vary depending on location, and will be reviewed upon your final order.",
      },
      {
        question: "How long does delivery take?",
        answer: "3-5 working days within the United Arab Emirates.\n7-14 days Worldwide*\n*May vary depending on exact location.",
      },
    ],
  },
  {
    title: "Returns & Support",
    questions: [
      {
        question: "My item has been damaged. Can you fix it?",
        answer: "Please contact info@xoperfumes.com and we will discuss any damages on a case-by-case basis.",
      },
      {
        question: "How can I pay?",
        answer: "All payments are to be made online.",
      },
      {
        question: "What is your return and exchange policy?",
        answer: `We want you to love and cherish your jewellery from XO Perfumes, but if you are not entirely happy, we can exchange or refund the item within 7 days from the date of delivery.

        All items should be unused, in excellent condition from the day it was ordered, and the packaging undamaged. All should be returned together.
        
        XO Perfumes reserves the right to refuse any exchange or refund.
        Refunds may take up to 14 working days, depending on your bank.
        Any courier charges when returning the item will be the responsibility of the customer, and will not be paid for by XO Perfumes.
        
        Please email info@xoperfumes.com for an exchange or refund.`,
      },
      {
        question: "Our privacy policy",
        answer: "We take your privacy very seriously. We are committed to protecting personal information and use industry-standard security measures to safeguard your data.",
      },
    ],
  },
]