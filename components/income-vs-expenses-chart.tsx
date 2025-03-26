"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/types/transaction"

interface IncomeVsExpensesChartProps {
  transactions?: Transaction[]
  onAddTransaction?: () => void
}

export function IncomeVsExpensesChart({ transactions = [], onAddTransaction }: IncomeVsExpensesChartProps) {
  // Verificar se há transações
  const hasTransactions = transactions.length > 0

  // Se não houver transações, mostrar estado vazio
  if (!hasTransactions) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <PlusIcon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Sem dados de receitas e despesas</h3>
        <p className="text-muted-foreground max-w-xs mb-4">
          Adicione transações para visualizar a comparação entre receitas e despesas.
        </p>
        {onAddTransaction && (
          <Button onClick={onAddTransaction} variant="outline" className="text-white border-white/20 hover:bg-white/10">
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar Transação
          </Button>
        )}
      </div>
    )
  }

  // Processar os dados das transações para o gráfico
  const processTransactionsData = () => {
    // Definir os meses em português
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

    // Criar um objeto para armazenar os totais por mês
    const monthlyData: Record<string, { income: number; expenses: number }> = {}

    // Inicializar todos os meses do ano atual
    const currentYear = new Date().getFullYear()
    monthNames.forEach((month, index) => {
      const key = `${currentYear}-${String(index + 1).padStart(2, "0")}`
      monthlyData[key] = { income: 0, expenses: 0 }
    })

    // Processar cada transação
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1 // Janeiro é 0, então adicionamos 1
      const key = `${year}-${String(month).padStart(2, "0")}`

      // Se o mês não existir no objeto, inicializar
      if (!monthlyData[key]) {
        monthlyData[key] = { income: 0, expenses: 0 }
      }

      // Adicionar o valor ao tipo correto
      if (transaction.type === "income") {
        monthlyData[key].income += transaction.amount
      } else {
        monthlyData[key].expenses += transaction.amount
      }
    })

    // Converter o objeto em um array para o gráfico
    const chartData = Object.entries(monthlyData)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Ordenar por data
      .map(([key, data]) => {
        const [year, monthNum] = key.split("-")
        const monthIndex = Number.parseInt(monthNum) - 1
        return {
          name: monthNames[monthIndex],
          income: data.income,
          expenses: data.expenses,
          // Adicionar o ano se for diferente do ano atual
          fullName:
            Number.parseInt(year) !== currentYear ? `${monthNames[monthIndex]}/${year}` : monthNames[monthIndex],
        }
      })

    return chartData
  }

  const data = processTransactionsData()

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#4b5563" // Cor mais clara para as linhas de grade
        />
        <XAxis
          dataKey="fullName"
          tick={{ fill: "#ffffff" }}
          stroke="#6b7280" // Cor mais clara para o eixo
        />
        <YAxis
          tick={{ fill: "#ffffff" }}
          stroke="#6b7280" // Cor mais clara para o eixo
        />
        <Tooltip
          formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
          labelFormatter={(label) => `Mês: ${label}`}
          contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }}
        />
        <Legend
          formatter={(value) => <span style={{ color: "#ffffff" }}>{value}</span>}
          wrapperStyle={{ paddingTop: "10px" }}
        />
        <Bar
          dataKey="income"
          fill="#22c55e" // Verde mais vibrante
          radius={[4, 4, 0, 0]} // Bordas arredondadas
          name="Receitas"
        />
        <Bar
          dataKey="expenses"
          fill="#ef4444" // Vermelho
          radius={[4, 4, 0, 0]} // Bordas arredondadas
          name="Despesas"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

