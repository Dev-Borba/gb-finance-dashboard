import { AuthTabs } from "@/components/auth/auth-tabs"
import { DollarSignIcon } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 dark">
        <div className="flex flex-col items-center space-y-8 w-full max-w-md">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20">
              <DollarSignIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-white">GB Finance Tracker</h1>
            <p className="text-center text-muted-foreground">
              Gerencie suas finanças pessoais de forma simples e eficiente
            </p>
          </div>

          <div className="w-full">
            <AuthTabs />
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Ao criar uma conta, você concorda com nossos{" "}
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

