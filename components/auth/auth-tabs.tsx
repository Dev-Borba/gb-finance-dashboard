"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
// Importar o componente SocialLoginButton
import { SocialLoginButton } from "./social-login-button"
import { Separator } from "@/components/ui/separator"

// Modificar o componente para incluir os botões de login social
export function AuthTabs() {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2 bg-background/50 border border-white/20">
        <TabsTrigger
          value="login"
          className="text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Entrar
        </TabsTrigger>
        <TabsTrigger
          value="register"
          className="text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Registrar
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login" className="mt-4">
        <LoginForm />
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <SocialLoginButton provider="google" />
            <SocialLoginButton provider="microsoft" />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="register" className="mt-4">
        <RegisterForm />
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou registre-se com</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <SocialLoginButton provider="google" />
            <SocialLoginButton provider="microsoft" />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

