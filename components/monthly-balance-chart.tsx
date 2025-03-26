"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/types/transaction"

interface MonthlyBalanceChartProps {
  transactions?: Transaction[]
  onAddTransaction?: () => void
}

export function MonthlyBalanceChart({ transactions = [], onAddTransaction }: MonthlyBalanceChartProps) {
  // Verificar se há transações
  const hasTransactions = transactions.length > 0

  // Se não houver transações, mostrar estado vazio
  if (!hasTransactions) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <PlusIcon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Sem dados de balanço mensal</h3>
        <p className="text-muted-foreground max-w-xs mb-4">
          Adicione transações para visualizar seu balanço mensal ao longo do tempo.
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

    // Criar um objeto para armazenar os saldos por mês
    const monthlyBalances: Record<string, number> = {}

    // Inicializar todos os meses do ano atual com saldo zero
    const currentYear = new Date().getFullYear()
    monthNames.forEach((month, index) => {
      const key = `${currentYear}-${String(index + 1).padStart(2, "0")}`
      monthlyBalances[key] = 0
    })

    // Processar cada transação
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1 // Janeiro é 0, então adicionamos 1
      const key = `${year}-${String(month).padStart(2, "0")}`

      // Se o mês não existir no objeto, inicializar com zero
      if (!monthlyBalances[key]) {
        monthlyBalances[key] = 0
      }

      // Adicionar ou subtrair o valor dependendo do tipo de transação
      if (transaction.type === "income") {
        monthlyBalances[key] += transaction.amount
      } else {
        monthlyBalances[key] -= transaction.amount
      }
    })

    // Converter o objeto em um array para o gráfico
    const chartData = Object.entries(monthlyBalances)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Ordenar por data
      .map(([key, balance]) => {
        const [year, monthNum] = key.split("-")
        const monthIndex = Number.parseInt(monthNum) - 1
        return {
          name: monthNames[monthIndex],
          balance: balance,
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
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#6b7280" // Cor mais clara para as linhas de grade
          vertical={true}
          horizontal={true}
        />
        <XAxis
          dataKey="fullName"
          tick={{ fill: "#ffffff" }}
          stroke="#9ca3af" // Cor mais clara para o eixo
        />
        <YAxis
          tick={{ fill: "#ffffff" }}
          stroke="#9ca3af" // Cor mais clara para o eixo
        />
        <Tooltip
          formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
          labelFormatter={(label) => `Mês: ${label}`}
          contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }}
        />
        <Legend formatter={(value) => <span style={{ color: "#ffffff" }}>{value}</span>} />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#22c55e"
          strokeWidth={3} // Linha mais grossa
          dot={{ stroke: "#22c55e", strokeWidth: 2, r: 4, fill: "#1f2937" }}
          activeDot={{ r: 8, stroke: "#ffffff", strokeWidth: 2 }}
          name="Saldo Mensal"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

