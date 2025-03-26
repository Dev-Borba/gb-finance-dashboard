"use client"

import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import type { Transaction } from "@/types/transaction"
import { useAuth } from "./use-auth"

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    // Em uma aplicação real, isso seria uma requisição para uma API
    const loadTransactions = () => {
      if (!user) {
        setTransactions([])
        setIsLoading(false)
        return
      }

      try {
        // Verifica se temos transações no localStorage para este usuário
        const storageKey = `transactions_${user.id}`
        const savedTransactions = localStorage.getItem(storageKey)

        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions))
        } else {
          // Para novos usuários, iniciar com um array vazio
          setTransactions([])
          localStorage.setItem(storageKey, JSON.stringify([]))
        }
      } catch (error) {
        console.error("Falha ao carregar transações:", error)
        setTransactions([])
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [user])

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    if (!user) return

    const newTransaction = {
      ...transaction,
      id: uuidv4(),
    }

    setTransactions((prev) => {
      const updated = [...prev, newTransaction]
      // Salva no localStorage com a chave específica do usuário
      const storageKey = `transactions_${user.id}`
      localStorage.setItem(storageKey, JSON.stringify(updated))
      return updated
    })
  }

  return {
    transactions,
    addTransaction,
    isLoading,
  }
}

