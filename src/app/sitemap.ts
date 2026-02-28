
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://www.xoperfumes.com";

    const staticPages = ['contact', 'faq', 'group-gift', 'shop', 'values', 'sustainable', 'story', 'size-guide', '']
    const lang = ['en'];
    const staticRoutes = staticPages.map((page) => {
        return lang.map((lang) => {
            return {
                url: `${baseUrl}/${lang}${page === '' ? '' : '/'}${page}`,
                lastModified: new Date("2025-02-12T08:20:50.376Z"),
            }
        })
    }).flat();

    return [...staticRoutes]
}