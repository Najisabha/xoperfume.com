"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState, FormEvent } from "react"
import { Loader2 } from "lucide-react"

export default function Footer({ lang, dict }: { lang: string; dict: any }) {
  const path = usePathname()
  const year = new Date().getFullYear()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  if (!dict || !dict.footer) return null

  const isRtl = lang === "ar" || lang === "he"

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError(false)
    setSuccess(false)

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) throw new Error("Failed")

      setSuccess(true)
      setEmail("")
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer dir={isRtl ? "rtl" : "ltr"} className={`border-t bg-white ${path.includes('admin') && '!border-none'}`}>
      <div className={`container mx-auto px-4 py-10 ${path.includes('admin') && '!pt-0 '}`}>
        <div className={`grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 ${path.includes('admin') && 'hidden'}`}>
          {/* Col 1: Logo & Follow Us */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col space-y-6">
            <Link href={`/${lang}`} className="hover:opacity-80 transition-opacity self-start">
              <img
                className="h-10 w-auto object-contain"
                src="/assets/xo-perfumes-logo.png"
                alt="XO Perfumes"
              />
            </Link>
            <div className="flex flex-col space-y-3">
              <p className="text-sm text-muted-foreground">
                {dict.footer.follow_us_desc}
              </p>
              <Link
                href="https://www.instagram.com/xoperfumes/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm hover:text-primary transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="me-2 text-foreground"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="font-medium text-foreground">@xoperfumes</span>
              </Link>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="col-span-1">
            <h3 className="mb-5 text-base font-semibold">{dict.footer.quick_links}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href={`/${lang}/shop`} className="hover:text-primary transition-colors duration-200">{dict.footer.shop}</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Client Services */}
          <div className="col-span-1">
            <h3 className="mb-5 text-base font-semibold">{dict.footer.client_services}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href={`/${lang}/faq`} className="hover:text-primary transition-colors duration-200">{dict.footer.faq}</Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`} className="hover:text-primary transition-colors duration-200">{dict.footer.contact_us}</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="mb-5 text-base font-semibold">{dict.footer.newsletter}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {dict.footer.newsletter_desc}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dict.footer.email_placeholder}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : dict.footer.subscribe}
                </button>
              </div>
              {success && <p className="text-xs text-green-600 font-medium">{dict.footer.subscribe_success}</p>}
              {error && <p className="text-xs text-red-600 font-medium">{dict.footer.subscribe_error}</p>}
            </form>
          </div>
        </div>

        <div
          className={`mt-10 border-t pt-8 text-center text-sm text-muted-foreground ${path.includes('admin') && 'mt-0'}`}
          dangerouslySetInnerHTML={{ __html: dict.footer.rights_reserved.replace('{year}', year.toString()) }}
        />
      </div>
    </footer>
  )
}