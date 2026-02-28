"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

export default function Footer({ lang, dict }: { lang: string; dict: any }) {
  const path = usePathname()
  const year = new Date().getFullYear()

  if (!dict || !dict.footer) return null

  return (
    <footer className={`border-t bg-white ${path.includes('admin') && '!border-none'}`}>
      <div className={`container mx-auto px-4 py-8 ${path.includes('admin') && '!pt-0 '}`}>
        <div className={`grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 ${path.includes('admin') && 'hidden'}`}>
          <div className="col-span-1">
            <h3 className="mb-4 text-lg font-semibold">{dict.footer.quick_links}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={`/${lang}/shop`} className="hover:text-primary transition-colors duration-200">{dict.footer.shop}</Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="mb-4 text-lg font-semibold">{dict.footer.client_services}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={`/${lang}/faq`} className="hover:text-primary transition-colors duration-200">{dict.footer.faq}</Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`} className="hover:text-primary transition-colors duration-200">{dict.footer.contact_us}</Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="mb-4 text-lg font-semibold">{dict.footer.follow_us}</h3>
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-muted-foreground">
                {dict.footer.follow_us_desc}
              </p>
              <div className="w-full">
                <Link
                  href="https://www.instagram.com/xoperfumes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm hover:text-primary transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                  @xoperfumes
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-8 border-t pt-8 text-center text-sm text-muted-foreground ${path.includes('admin') && 'mt-0'}`}
          dangerouslySetInnerHTML={{ __html: dict.footer.rights_reserved.replace('{year}', year.toString()) }}
        />
      </div>
    </footer>
  )
}