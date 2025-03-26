"use client"

import { useEffect, useState } from "react"
import type { Transaction } from "@/types/transaction"
import { useAuth } from "./use-auth"
import { supabase } from "@/lib/supabase"

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) {
        setTransactions([])
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })

        if (error) throw error

        setTransactions(data || [])
      } catch (error) {
        console.error("Falha ao carregar transações:", error)
        setTransactions([])
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()

    // Inscrever-se para atualizações em tempo real
    const channel = supabase
      .channel('transactions_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
          filter: `user_id=eq.${user?.id}` 
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTransactions(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setTransactions(prev => prev.filter(t => t.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setTransactions(prev => prev.map(t => t.id === payload.new.id ? payload.new : t))
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user])

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // A atualização do estado será feita através da inscrição em tempo real
    } catch (error) {
      console.error("Erro ao adicionar transação:", error)
    }
  }

  return {
    transactions,
    addTransaction,
    isLoading,
  }
}

