import HeroSlider from "@/components/hero-slider"
import { getDictionary } from "@/lib/get-dictionary"
import HomeCollections from "@/components/home/home-collections"
import HomeFeatured from "@/components/home/home-featured"
import HomeStory from "@/components/home/home-story"

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

        <HomeCollections lang={lang} dict={dict} />

        {/* <HomeStory lang={lang} dict={dict} /> */}

        {/* <HomeFeatured lang={lang} dict={dict} /> */}
      </div>
    </>
  )
}

