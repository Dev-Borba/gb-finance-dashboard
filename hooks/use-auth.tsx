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

  // Carregar estado de autenticação do Supabase ao iniciar
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email?.split("@")[0] || "",
          email: session.user.email || "",
          password: "",
          createdAt: session.user.created_at,
        }
        setAuthState({
          user,
          isAuthenticated: true,
        })
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, message: error.message }
      }

      if (!data.user) {
        return { success: false, message: "Email ou senha incorretos" }
      }

      const user: User = {
        id: data.user.id,
        name: data.user.user_metadata.name || data.user.email?.split("@")[0] || "",
        email: data.user.email || "",
        password: "", // Não armazenamos a senha
        createdAt: data.user.created_at,
      }

      setAuthState({
        user,
        isAuthenticated: true,
      })

      return { success: true, message: "Login realizado com sucesso" }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      return { success: false, message: "Ocorreu um erro ao fazer login" }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        return { success: false, message: error.message }
      }

      if (!data.user) {
        return { success: false, message: "Erro ao criar conta" }
      }

      const user: User = {
        id: data.user.id,
        name: name,
        email: data.user.email || "",
        password: "", // Não armazenamos a senha
        createdAt: data.user.created_at,
      }

      setAuthState({
        user,
        isAuthenticated: true,
      })

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

