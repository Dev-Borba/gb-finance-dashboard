import { DashboardPage } from "@/components/dashboard-page"
import { ThemeProvider } from "@/components/theme-provider"

export default function Dashboard() {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <DashboardPage />
    </ThemeProvider>
  )
}

