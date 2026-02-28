import Link from "next/link"

export default function HomeStory({ lang, dict }: { lang: string, dict: any }) {
    const isRtl = lang === 'ar' || lang === 'he';

    return (
        <section className="py-32 relative bg-background overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="absolute inset-0 bg-muted/20 -skew-y-3 origin-top-left transform" />

            <div className="container mx-auto px-4 relative z-10">
                <div className={`flex flex-col md:flex-row items-center gap-16 lg:gap-32 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                    <div className="w-full md:w-5/12 relative group">
                        {/* Overlapping images layout */}
                        <div className="relative z-10 aspect-[3/4] w-4/5 ml-auto overflow-hidden shadow-2xl">
                            <img
                                src="/assets/banners/makeup-beauty.png"
                                alt="Brand Story"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-[1.5s] ease-in-out"
                            />
                        </div>
                        <div className="absolute z-20 bottom-10 left-0 aspect-[4/3] w-2/3 overflow-hidden shadow-xl border-4 border-background translate-y-12 translate-x-4 group-hover:-translate-y-4 transition-transform duration-1000 ease-out">
                            <img
                                src="/assets/banners/women-perfume.png"
                                alt="Brand Details"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-[1.5s]"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-7/12 flex flex-col justify-center space-y-10 pl-6 md:pl-0 pt-16 md:pt-0">
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-foreground tracking-tighter leading-tight relative">
                            <span className="relative z-10">{dict.home.story.title}</span>
                            <span className={`absolute -top-8 ${isRtl ? '-right-4' : '-left-4'} text-8xl md:text-9xl text-muted/30 font-serif z-0 select-none`}>
                                &quot;
                            </span>
                        </h2>
                        <div className="h-px w-32 bg-foreground/20" />
                        <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed font-light max-w-2xl">
                            {dict.home.story.description}
                        </p>
                        <div className="pt-4">
                            <Link
                                href={`/${lang}/our-world`}
                                className="group inline-flex items-center gap-4 text-sm font-medium transition-colors uppercase tracking-[0.2em]"
                            >
                                <span className="border-b border-foreground pb-1 group-hover:border-primary group-hover:text-primary transition-colors">
                                    {dict.home.story.button}
                                </span>
                                <span className="w-8 h-px bg-foreground group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
