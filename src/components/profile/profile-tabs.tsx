"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "./profile-form"
import { PasswordForm } from "./password-form"
import { AddressBook } from "./address-book"
import { OrderHistory } from "./order-history"

export function ProfileTabs({ openTab }: { openTab?: string }) {
  return (
    <Tabs defaultValue={openTab ? openTab : "profile"} className="space-y-6">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="addresses">Addresses</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <div className="max-w-2xl">
          <ProfileForm />
        </div>
      </TabsContent>

      <TabsContent value="password" className="space-y-6">
        <div className="max-w-2xl">
          <PasswordForm />
        </div>
      </TabsContent>

      <TabsContent value="addresses">
        <AddressBook />
      </TabsContent>

      <TabsContent value="orders">
        <OrderHistory lang={'en'} />
      </TabsContent>

    </Tabs>
  )
} 