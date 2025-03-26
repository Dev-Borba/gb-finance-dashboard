"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

// Importar as funções de validação de email
import { isValidEmail, verifyEmailDomain } from "./email-validator"

// Adicionar funções de validação de senha no início do arquivo, após as importações existentes

// Função para validar a força da senha
function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Verificar comprimento mínimo
  if (password.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres")
  }

  // Verificar se contém pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula")
  }

  // Verificar se contém pelo menos um número
  if (!/[0-9]/.test(password)) {
    errors.push("A senha deve conter pelo menos um número")
  }

  // Verificar se contém pelo menos um caractere especial
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("A senha deve conter pelo menos um caractere especial")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Adicionar estado para controlar a validação de email
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailError, setEmailError] = useState("")

  // Modificar o componente RegisterForm para incluir as novas validações
  // Adicionar estados para os erros de senha
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [passwordTouched, setPasswordTouched] = useState(false)

  // Modificar a função handleSubmit para incluir validação de email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar formato de email
    if (!isValidEmail(email)) {
      setEmailError("Por favor, insira um email válido")
      return
    }

    // Validar senha
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setPasswordErrors(passwordValidation.errors)
      return
    }

    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas digitadas são iguais.",
        variant: "destructive",
      })
      return
    }

    setIsCheckingEmail(true)
    setEmailError("")

    try {
      // Verificar se o domínio do email é válido
      const isValidDomain = await verifyEmailDomain(email)

      if (!isValidDomain) {
        setEmailError("Por favor, use um email com domínio válido")
        return
      }

      setIsLoading(true)

      const result = await register(name, email, password)

      if (result.success) {
        toast({
          title: "Conta criada com sucesso",
          description: "Bem-vindo ao seu dashboard financeiro.",
          variant: "default",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Erro ao criar conta",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingEmail(false)
      setIsLoading(false)
    }
  }

  // Adicionar função para validar a senha enquanto o usuário digita
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)

    if (passwordTouched) {
      const validation = validatePassword(newPassword)
      setPasswordErrors(validation.errors)
    }
  }

  // Adicionar função para marcar o campo de senha como "tocado"
  const handlePasswordBlur = () => {
    setPasswordTouched(true)
    const validation = validatePassword(password)
    setPasswordErrors(validation.errors)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-white">Criar uma nova conta</h2>
        <p className="text-muted-foreground">Preencha os dados abaixo para começar a gerenciar suas finanças</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Nome
          </Label>
          <Input
            id="name"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background border-white/20 text-white"
            required
          />
        </div>
        {/* Modificar o campo de email para mostrar erro */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError("")
            }}
            className={`bg-background border-white/20 text-white ${emailError ? "border-red-500" : ""}`}
            required
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
          {isCheckingEmail && <p className="text-sm text-muted-foreground">Verificando email...</p>}
        </div>
        {/* Modificar o campo de senha no JSX para incluir as novas validações */}
        {/* Substituir o campo de senha existente pelo seguinte: */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            className={`bg-background border-white/20 text-white ${
              passwordErrors.length > 0 && passwordTouched ? "border-red-500" : ""
            }`}
            required
          />
          {passwordTouched && passwordErrors.length > 0 && (
            <div className="text-sm text-red-500 space-y-1">
              {passwordErrors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-white">
            Confirmar Senha
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-background border-white/20 text-white"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
          {isLoading ? "Criando conta..." : "Criar Conta"}
        </Button>
      </form>
    </div>
  )
}

