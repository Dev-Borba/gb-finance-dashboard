import type { Transaction } from "@/types/transaction"

export function exportToCSV(data: Transaction[], filename: string) {
  // Define os cabeçalhos para o arquivo CSV
  const headers = ["ID", "Descrição", "Valor", "Tipo", "Categoria", "Data"]

  // Tradução das categorias e tipos
  const translateCategory = (category: string) => {
    const translations: Record<string, string> = {
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
    return translations[category] || category
  }

  const translateType = (type: string) => {
    return type === "income" ? "Receita" : "Despesa"
  }

  // Converte os dados para o formato CSV
  const csvRows = []

  // Adiciona os cabeçalhos
  csvRows.push(headers.join(","))

  // Adiciona as linhas de dados
  for (const row of data) {
    const values = [
      row.id,
      `"${row.description.replace(/"/g, '""')}"`, // Escapa aspas na descrição
      row.amount,
      translateType(row.type),
      translateCategory(row.category),
      new Date(row.date).toLocaleDateString("pt-BR"),
    ]
    csvRows.push(values.join(","))
  }

  // Combina em uma única string
  const csvString = csvRows.join("\n")

  // Cria um blob e link para download
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

