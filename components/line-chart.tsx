"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LineChartProps {
  data: any[]
  dataKey: string
  xAxisDataKey: string
  name: string
  color: string
  height?: number
  onAddTransaction?: () => void
}

export function CustomLineChart({
  data,
  dataKey,
  xAxisDataKey,
  name,
  color,
  height = 300,
  onAddTransaction,
}: LineChartProps) {
  // Verificar se há dados
  const hasData = data && data.length > 0

  // Se não houver dados, mostrar estado vazio
  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <PlusIcon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Sem dados disponíveis</h3>
        <p className="text-muted-foreground max-w-xs mb-4">Adicione transações para visualizar este gráfico.</p>
        {onAddTransaction && (
          <Button onClick={onAddTransaction} variant="outline" className="text-white border-white/20 hover:bg-white/10">
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar Transação
          </Button>
        )}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#6b7280" // Cor mais clara para as linhas de grade
          vertical={true}
          horizontal={true}
        />
        <XAxis
          dataKey={xAxisDataKey}
          tick={{ fill: "#ffffff" }}
          stroke="#9ca3af" // Cor mais clara para o eixo
        />
        <YAxis
          tick={{ fill: "#ffffff" }}
          stroke="#9ca3af" // Cor mais clara para o eixo
        />
        <Tooltip
          formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
          contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#ffffff" }}
        />
        <Legend formatter={(value) => <span style={{ color: "#ffffff" }}>{value}</span>} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={3} // Linha mais grossa
          dot={{ stroke: color, strokeWidth: 2, r: 4, fill: "#1f2937" }}
          activeDot={{ r: 8, stroke: "#ffffff", strokeWidth: 2 }}
          name={name}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

