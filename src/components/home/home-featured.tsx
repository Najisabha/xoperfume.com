import Link from "next/link"

export default function HomeFeatured({ lang, dict }: { lang: string, dict: any }) {
    const isRtl = lang === 'ar' || lang === 'he';

    return (
        <section className="py-24 md:py-32" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center mb-20 text-center space-y-4">
                    <span className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">{dict.home.featured.subtitle}</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-foreground tracking-tight">
                        {dict.home.featured.title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Banner 1 - Taller */}
                    <Link href={`/${lang}/shop/women-perfume`} className="col-span-1 md:col-span-7 group block relative overflow-hidden aspect-[4/5] md:aspect-[3/4] lg:aspect-square bg-muted shadow-lg">
                        <img
                            src="/assets/banners/women-perfume.png"
                            alt="Women Collection"
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="absolute inset-x-0 bottom-0 p-8 md:p-14 text-white">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                                <h3 className="text-3xl md:text-5xl font-light mb-4 tracking-wide text-white">{dict.home.featured.banner_1}</h3>
                                <div className="h-px w-24 bg-white/50 mb-6" />
                                <p className="text-white/90 text-lg md:text-xl font-light max-w-md">
                                    {dict.home.featured.banner_1_desc}
                                </p>
                                <span className="inline-block mt-8 text-sm uppercase tracking-widest border-b border-white pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                    Explore
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Banner 2 - Wider */}
                    <Link href={`/${lang}/shop/men-perfume`} className="col-span-1 md:col-span-5 group block relative overflow-hidden aspect-[4/5] md:aspect-[3/4] bg-muted shadow-lg md:-mt-32 hover:z-10">
                        <img
                            src="/assets/banners/men-perfume.png"
                            alt="Men Collection"
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 text-white">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                                <h3 className="text-2xl md:text-4xl font-light mb-3 tracking-wide text-white">{dict.home.featured.banner_2}</h3>
                                <div className="h-px w-16 bg-white/50 mb-4" />
                                <p className="text-white/90 text-base md:text-lg font-light max-w-sm">
                                    {dict.home.featured.banner_2_desc}
                                </p>
                                <span className="inline-block mt-6 text-sm uppercase tracking-widest border-b border-white pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                    Explore
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
