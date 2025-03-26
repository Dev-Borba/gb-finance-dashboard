"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, DownloadIcon, LogOutIcon, PlusIcon, UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { ExpensesByCategoryChart } from "./expenses-by-category-chart"
import { MonthlyBalanceChart } from "./monthly-balance-chart"
import { TransactionsTable } from "./transactions-table"
import { exportToCSV } from "@/lib/export-to-csv"
import { useTransactions } from "@/hooks/use-transactions"
import { useAuth } from "@/hooks/use-auth"

// Lista de categorias predefinidas
const categories = [
  { value: "housing", label: "Moradia" },
  { value: "food", label: "Alimentação" },
  { value: "transportation", label: "Transporte" },
  { value: "utilities", label: "Serviços" },
  { value: "entertainment", label: "Entretenimento" },
  { value: "healthcare", label: "Saúde" },
  { value: "salary", label: "Salário" },
  { value: "investment", label: "Investimento" },
  { value: "other", label: "Outros" },
]

export function DashboardPage() {
  const { transactions, addTransaction, isLoading } = useTransactions()
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [customCategory, setCustomCategory] = useState("")
  const { user, logout } = useAuth()
  const router = useRouter()

  // Redirecionar para a página de login se não estiver autenticado
  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const balance = totalIncome - totalExpenses

  const handleExportCSV = () => {
    exportToCSV(transactions, "financas-transacoes")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Usar a categoria personalizada se existir, senão usar "other"
    const categoryToUse = customCategory || "other"

    const data = {
      description: formData.get("description") as string,
      amount: Number.parseFloat(formData.get("amount") as string),
      type: formData.get("type") as "income" | "expense",
      category: categoryToUse,
      date: new Date(formData.get("date") as string).toISOString(),
    }

    addTransaction(data)
    setIsAddTransactionOpen(false)
    setCustomCategory("")
  }

  const openAddTransactionDialog = () => {
    setIsAddTransactionOpen(true)
  }

  const isNewUser = transactions.length === 0 && !isLoading

  if (!user) {
    return null // Não renderiza nada enquanto redireciona
  }

  return (
    <div className="flex min-h-screen w-full flex-col dark">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <DollarSignIcon className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold text-white">GB Dashboard de Finanças Pessoais</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-white">{user.name}</span>
          </div>
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <PlusIcon className="mr-2 h-4 w-4" />
                Adicionar Transação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar Nova Transação</DialogTitle>
                <DialogDescription className="text-white">
                  Insira os detalhes da sua transação abaixo.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right text-white">
                      Descrição
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      className="col-span-3 bg-background border-white/20 text-white"
                      placeholder="Digite aqui"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right text-white">
                      Valor
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue="0.00"
                      className="col-span-3 bg-background border-white/20 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right text-white">
                      Tipo
                    </Label>
                    <Select name="type" defaultValue="expense">
                      <SelectTrigger id="type" className="col-span-3 bg-background border-white/20 text-white">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Receita</SelectItem>
                        <SelectItem value="expense">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right text-white">
                      Categoria
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        id="category"
                        name="category"
                        className="w-full bg-background border-white/20 text-white"
                        placeholder="Digite sua própria categoria"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Digite sua própria categoria ou selecione uma das predefinidas abaixo
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Button
                            key={category.value}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={cn(
                              "text-white border-white/20 hover:bg-white/10",
                              customCategory === category.value &&
                                "bg-primary text-primary-foreground hover:bg-primary/90",
                            )}
                            onClick={() => {
                              setCustomCategory(category.value)
                            }}
                          >
                            {category.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right text-white">
                      Data
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      className="col-span-3 bg-background border-white/20 text-white [color-scheme:dark]"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Salvar Transação
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="text-white border-white/20 hover:bg-white/10 hover:text-white"
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button variant="ghost" onClick={logout} className="text-white hover:bg-white/10">
            <LogOutIcon className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:ml-2">Sair</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 bg-background">
        <div className="grid gap-4 md:grid-cols-3 md:gap-8">
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Saldo atual em todas as contas</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas Totais</CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">R$ {totalIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total de receitas no período atual</p>
            </CardContent>
          </Card>
          <Card className="border-rose-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
              <ArrowDownIcon className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-500">R$ {totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total de despesas no período atual</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 border-primary/20">
            <CardHeader>
              <CardTitle>Visão Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-[#111827] p-2 rounded-lg">
                {" "}
                {/* Fundo ligeiramente mais claro para o gráfico */}
                <MonthlyBalanceChart transactions={transactions} onAddTransaction={openAddTransactionDialog} />
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 border-primary/20">
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpensesByCategoryChart transactions={transactions} onAddTransaction={openAddTransactionDialog} />
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>
                {isNewUser
                  ? "Bem-vindo! Comece a adicionar suas transações financeiras"
                  : "Gerencie suas transações financeiras recentes"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isNewUser ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-primary/10 p-6 mb-4">
                    <PlusIcon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Comece a rastrear suas finanças</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Adicione sua primeira transação para começar a acompanhar suas receitas e despesas.
                  </p>
                  <Button onClick={openAddTransactionDialog} className="bg-primary hover:bg-primary/90">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Adicionar Primeira Transação
                  </Button>
                </div>
              ) : (
                <TransactionsTable transactions={transactions} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

