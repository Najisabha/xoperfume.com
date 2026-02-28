import HeroSlider from "@/components/hero-slider"
import Link from "next/link"
import { getDictionary } from "@/lib/get-dictionary"

export default async function Home({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const dict = await getDictionary(lang)

  return (
    <>
      <div className="min-h-screen w-full">
        {/* Hero Section */}
        <section className="relative w-full">
          <HeroSlider lang={lang} dict={dict.home.hero} />
        </section>

        {/* Collections Preview */}
        <section className="relative min-h-screen bg-background py-16 md:py-20 overflow-hidden" dir={(lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr'}>

          <div className="container relative z-10 mx-auto px-4 pt-2">
            <div className="text-center md:mb-24">
              <h2 className="text-3xl md:text-4xl font-light mb-4">
                {dict.home.title}
              </h2>
              <p className="text-base md:text-lg px-4">
                {dict.home.description}
              </p>
            </div>

            <div className="flex mx-auto flex-col md:flex-row justify-center gap-4 md:gap-8">
              {/* Collection 1 */}
              <div className="text-center">
                <Link href={`/${lang}/shop/men-perfume`}
                  className="group">
                  <img
                    src="/assets/collection/men-perfume.png"
                    alt="Men Collection"
                    width={450}
                    height={450}
                    className="mx-auto aspect-square object-cover hover:scale-105 transition-all"
                  />
                  <h3 className="mt-4 text-xl font-light tracking-wide group-hover:font-medium transition-all">
                    {dict.home.categories.men_perfume}
                  </h3>
                </Link>
              </div>

              {/* Collection 2 */}
              <div className="text-center">
                <Link href={`/${lang}/shop/women-perfume`}
                  className="group">
                  <img
                    src="/assets/collection/women-perfume.png"
                    alt="Women Collection"
                    width={450}
                    height={450}
                    className="mx-auto aspect-square object-cover hover:scale-105 transition-all"
                  />
                  <h3 className="mt-4 text-xl font-light tracking-wide group-hover:font-medium transition-all">
                    {dict.home.categories.women_perfume}
                  </h3>
                </Link>
              </div>

              {/* Collection 3 */}
              <div className="text-center">
                <Link
                  href={`/${lang}/shop/makeup-beauty`}
                  className="group">
                  <img
                    src="/assets/collection/makeup-beauty.png"
                    alt="Beauty Collection"
                    width={450}
                    height={450}
                    className=" mx-auto object-cover aspect-square hover:scale-105 transition-all"
                  />
                  <h3 className="mt-4 text-xl font-light tracking-wide group-hover:font-medium transition-all">
                    {dict.home.categories.makeup_beauty}
                  </h3>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
