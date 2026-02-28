"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "./profile-form"
import { PasswordForm } from "./password-form"
import { AddressBook } from "./address-book"
import { OrderHistory } from "./order-history"

export function ProfileTabs({ openTab, lang, dict }: { openTab?: string, lang: string, dict: any }) {
  const t = dict?.profile || {}
  const isRtl = lang === 'ar' || lang === 'he'

  return (
    <Tabs defaultValue={openTab ? openTab : "profile"} className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <TabsList className={isRtl ? 'flex-row-reverse' : ''}>
        <TabsTrigger value="profile">{t.profile || 'Profile'}</TabsTrigger>
        <TabsTrigger value="password">{t.password || 'Password'}</TabsTrigger>
        <TabsTrigger value="addresses">{t.addresses || 'Addresses'}</TabsTrigger>
        <TabsTrigger value="orders">{t.orders || 'Orders'}</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <div className="max-w-2xl">
          <ProfileForm lang={lang} dict={dict} />
        </div>
      </TabsContent>

      <TabsContent value="password" className="space-y-6">
        <div className="max-w-2xl">
          <PasswordForm lang={lang} dict={dict} />
        </div>
      </TabsContent>

      <TabsContent value="addresses">
        <AddressBook lang={lang} dict={dict} />
      </TabsContent>

      <TabsContent value="orders">
        <OrderHistory lang={lang} dict={dict} />
      </TabsContent>

    </Tabs>
  )
} 