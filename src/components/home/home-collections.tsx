import Link from "next/link"

export default function HomeCollections({ lang, dict }: { lang: string, dict: any }) {
    const isRtl = lang === 'ar' || lang === 'he';

    return (
        <section className="relative bg-background py-20 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="container relative z-10 mx-auto px-4">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-foreground/10 pb-6">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight mb-4 text-foreground tracking-tight">
                            {dict.home.title}
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground font-light">
                            {dict.home.description}
                        </p>
                    </div>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 -mx-4 px-4 custom-scrollbar">
                    {/* Collection 1 */}
                    <div className="snap-center shrink-0 w-[85vw] sm:w-[50vw] md:w-[400px]">
                        <Link href={`/${lang}/shop/men-perfumes`} className="group block">
                            <div className="relative overflow-hidden aspect-[4/5] bg-muted/20">
                                <img
                                    src="/assets/collection/men-perfume.png"
                                    alt="Men Collection"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 sm:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-white mb-2">
                                        {dict.home.categories.men_perfume}
                                    </h3>
                                    <div className="h-px w-12 bg-white/50 group-hover:w-full transition-all duration-700 ease-out" />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Collection 2 */}
                    <div className="snap-center shrink-0 w-[85vw] sm:w-[50vw] md:w-[400px]">
                        <Link href={`/${lang}/shop/women-perfumes`} className="group block">
                            <div className="relative overflow-hidden aspect-[4/5] bg-muted/20">
                                <img
                                    src="/assets/collection/women-perfume.png"
                                    alt="Women Collection"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 sm:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-white mb-2">
                                        {dict.home.categories.women_perfume}
                                    </h3>
                                    <div className="h-px w-12 bg-white/50 group-hover:w-full transition-all duration-700 ease-out" />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Collection 3 */}
                    <div className="snap-center shrink-0 w-[85vw] sm:w-[50vw] md:w-[400px]">
                        <Link href={`/${lang}/shop/makeup-and-beauty`} className="group block">
                            <div className="relative overflow-hidden aspect-[4/5] bg-muted/20">
                                <img
                                    src="/assets/collection/makeup-beauty.png"
                                    alt="Beauty Collection"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 sm:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-white mb-2">
                                        {dict.home.categories.makeup_beauty}
                                    </h3>
                                    <div className="h-px w-12 bg-white/50 group-hover:w-full transition-all duration-700 ease-out" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
