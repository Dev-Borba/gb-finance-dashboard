"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/types/transaction"

// Cores mais vibrantes para as categorias
const categoryColors: Record<string, string> = {
  housing: "#22c55e", // Verde mais vibrante
  food: "#3b82f6", // Azul
  transportation: "#f59e0b", // Amarelo
  utilities: "#a855f7", // Roxo mais vibrante
  entertainment: "#ec4899", // Rosa
  healthcare: "#ef4444", // Vermelho
  salary: "#22c55e", // Verde mais vibrante
  investment: "#3b82f6", // Azul
  other: "#94a3b8", // Cinza mais claro
}

// Tradução das categorias para exibição
const categoryTranslations: Record<string, string> = {
  housing: "Moradia",
  food: "Alimentação",
  transportation: "Transporte",
  utilities: "Serviços",
  entertainment: "Entretenimento",
  healthcare: "Saúde",
  salary: "Salário",
  investment: "Investimento",
  other: "Outros",
}

interface ExpensesByCategoryChartProps {
  transactions?: Transaction[]
  onAddTransaction?: () => void
}

export function ExpensesByCategoryChart({ transactions = [], onAddTransaction }: ExpensesByCategoryChartProps) {
  // Filtrar apenas as transações de despesas
  const expenseTransactions = transactions.filter((t) => t.type === "expense")

  // Verificar se há transações de despesas
  const hasExpenses = expenseTransactions.length > 0

  // Se não houver despesas, mostrar estado vazio
  if (!hasExpenses) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <PlusIcon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Sem dados de despesas</h3>
        <p className="text-muted-foreground max-w-xs mb-4">
          Adicione transações de despesas para visualizar a distribuição por categoria.
        </p>
        {onAddTransaction && (
          <Button onClick={onAddTransaction} variant="outline" className="text-white border-white/20 hover:bg-white/10">
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar Despesa
          </Button>
        )}
      </div>
    )
  }

  // Processar os dados das transações para o gráfico
  const processExpensesData = () => {
    // Criar um objeto para armazenar os totais por categoria
    const categoryTotals: Record<string, number> = {}

    // Processar cada transação de despesa
    expenseTransactions.forEach((transaction) => {
      const { category, amount } = transaction

      // Se a categoria não existir no objeto, inicializar com zero
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0
      }

      // Adicionar o valor da despesa à categoria
      categoryTotals[category] += amount
    })

    // Converter o objeto em um array para o gráfico
    const chartData = Object.entries(categoryTotals).map(([category, value]) => {
      // Obter a cor da categoria ou usar uma cor padrão
      const color = categoryColors[category] || "#94a3b8"

      // Obter o nome traduzido da categoria ou usar o próprio valor
      const name = categoryTranslations[category] || category.charAt(0).toUpperCase() + category.slice(1)

      return {
        name,
        value,
        color,
      }
    })

    // Ordenar por valor (do maior para o menor)
    return chartData.sort((a, b) => b.value - a.value)
  }

  const data = processExpensesData()

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelStyle={{ fill: "#ffffff" }}
          strokeWidth={2} // Borda mais grossa
          stroke="#1f2937" // Cor da borda para separar as fatias
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
          contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }}
        />
        <Legend
          formatter={(value) => <span style={{ color: "#ffffff" }}>{value}</span>}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconSize={10}
          iconType="circle"
          wrapperStyle={{ paddingTop: "20px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

