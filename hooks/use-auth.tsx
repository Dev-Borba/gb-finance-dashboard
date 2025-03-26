"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation"
import type { AuthState, User } from "@/types/user"
import { supabase } from "@/lib/supabase"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  })
  const router = useRouter()

  // Carregar estado de autenticação do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setAuthState({
          user,
          isAuthenticated: true,
        })
      } catch (error) {
        console.error("Erro ao carregar usuário:", error)
        localStorage.removeItem("currentUser")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Simular uma chamada de API com um pequeno delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      // Buscar usuários do localStorage
      const storedUsers = localStorage.getItem("users")
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : []

      // Verificar se o usuário existe e a senha está correta
      const user = users.find((u) => u.email === email && u.password === password)

      if (!user) {
        return { success: false, message: "Email ou senha incorretos" }
      }

      // Atualizar estado de autenticação
      setAuthState({
        user,
        isAuthenticated: true,
      })

      // Salvar usuário atual no localStorage
      localStorage.setItem("currentUser", JSON.stringify(user))

      return { success: true, message: "Login realizado com sucesso" }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      return { success: false, message: "Ocorreu um erro ao fazer login" }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    // Simular uma chamada de API com um pequeno delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      // Buscar usuários existentes do localStorage
      const storedUsers = localStorage.getItem("users")
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : []

      // Verificar se o email já está em uso
      if (users.some((u) => u.email === email)) {
        return { success: false, message: "Este email já está em uso" }
      }

      // Criar novo usuário
      const newUser: User = {
        id: uuidv4(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      }

      // Adicionar novo usuário à lista
      const updatedUsers = [...users, newUser]
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Atualizar estado de autenticação
      setAuthState({
        user: newUser,
        isAuthenticated: true,
      })

      // Salvar usuário atual no localStorage
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      return { success: true, message: "Conta criada com sucesso" }
    } catch (error) {
      console.error("Erro ao registrar:", error)
      return { success: false, message: "Ocorreu um erro ao criar a conta" }
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setAuthState({
        user: null,
        isAuthenticated: false,
      })
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

