import HeroSlider from "@/components/hero-slider"
import Link from "next/link"
import { getDictionary } from "@/lib/get-dictionary"

export default async function Home({ params }: { params: any }) {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const dict = await getDictionary(lang)

  return (
    <>
      <div className="min-h-screen overflow-y-auto pt-32">
        {/* Hero Section with snap */}
        <section className="relative -mt-32 h-[100vh] snap-start snap-always">
          <HeroSlider lang={lang} dict={dict.home.hero} />
        </section>

        {/* Collections Preview */}
        <section className="relative min-h-screen bg-background py-16 md:py-20 overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {/* Decorative Patterns */}
          {/* left */}
          <div className="absolute left-[-0px] top-[20%] w-[200px] h-[200px] opacity-90 rotate-[-15deg]">
            <img
              src="/assets/drawings/ai20.svg"
              alt="Decorative pattern 1"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-[-0px] left-[28%] w-[200px] h-[200px] opacity-90 rotate-[5deg]">
            <img
              src="/assets/drawings/ai10.svg"
              alt="Decorative pattern 3"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-[-0px] left-[2%] w-[200px] h-[200px] opacity-90 rotate-[5deg]">
            <img
              src="/assets/drawings/ai3.svg"
              alt="Decorative pattern 3"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>

          {/* right */}
          <div className="absolute right-[-4px] top-[17%] w-[250px] h-[250px] opacity-90 rotate-[10deg]">
            <img
              src="/assets/drawings/ai18.svg"
              alt="Decorative pattern 2"
              width={250}
              height={250}
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-[30px] left-[58%] w-[180px] h-[180px] opacity-90 rotate-[5deg]">
            <img
              src="/assets/drawings/ai7.svg"
              alt="Decorative pattern 3"
              width={180}
              height={180}
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-[-0px] right-[3%] w-[180px] h-[180px] opacity-90 rotate-[5deg]">
            <img
              src="/assets/drawings/ai13.svg"
              alt="Decorative pattern 3"
              width={180}
              height={180}
              className="object-contain"
            />
          </div>

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
                <Link href={`/${lang}/shop/bracelets`}
                  className="group">
                  <img
                    src="/assets/collection/Bracelet Layout 2.png"
                    alt="Collection 1"
                    width={450}
                    height={450}
                    className="mx-auto aspect-square object-cover hover:scale-105 transition-all"
                  />
                  <h3 className="mt-4 text-xl font-light tracking-wide group-hover:font-medium transition-all">
                    {dict.home.categories.bracelets}
                  </h3>
                </Link>
              </div>

              {/* Collection 2 */}
              <div className="text-center">
                <Link href={`/${lang}/shop/earrings`}
                  className="group">
                  <img
                    src="/assets/collection/Earring Layout 2.png"
                    alt="Collection 2"
                    width={450}
                    height={450}
                    className="mx-auto aspect-square object-cover hover:scale-105 transition-all"
                  />
                  <h3 className="mt-4 text-xl font-light tracking-wide group-hover:font-medium transition-all">
                    {dict.home.categories.earrings}
                  </h3>
                </Link>
              </div>

              {/* Collection 3 */}
              <div className="text-center">
                <Link
                  href={`/${lang}/shop/necklaces`}
                  className="group">
                  <img
                    src="/assets/collection/Necklace Layout 2.png"
                    alt="Collection 3"
                    width={450}
                    height={450}
                    className=" mx-auto object-cover aspect-square hover:scale-105 transition-all"
                  />
                  <h3 className="mt-4 text-xl font-light tracking-wide group-hover:font-medium transition-all">
                    {dict.home.categories.necklaces}
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
