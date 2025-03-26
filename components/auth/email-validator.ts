// Melhorar a função de validação de email para ser mais rigorosa
export function isValidEmail(email: string): boolean {
  // Expressão regular mais completa para validação de email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  // Verificar se o email corresponde ao padrão
  if (!emailRegex.test(email)) {
    return false
  }

  // Verificar se o domínio tem pelo menos um ponto
  const parts = email.split("@")
  if (parts.length !== 2) {
    return false
  }

  const domain = parts[1]
  if (!domain.includes(".")) {
    return false
  }

  // Verificar se a extensão do domínio tem pelo menos 2 caracteres
  const extension = domain.split(".").pop()
  if (!extension || extension.length < 2) {
    return false
  }

  return true
}

// Expandir a lista de domínios válidos
export async function verifyEmailDomain(email: string): Promise<boolean> {
  try {
    const domain = email.split("@")[1]

    // Lista expandida de domínios comuns que consideramos válidos
    const validDomains = [
      "gmail.com",
      "outlook.com",
      "hotmail.com",
      "yahoo.com",
      "icloud.com",
      "aol.com",
      "protonmail.com",
      "mail.com",
      "zoho.com",
      "yandex.com",
      "gmx.com",
      "live.com",
      "msn.com",
      "uol.com.br",
      "bol.com.br",
      "terra.com.br",
      "globo.com",
      "ig.com.br",
      "r7.com",
      "outlook.com.br",
      "hotmail.com.br",
      "yahoo.com.br",
      "me.com",
      "mac.com",
      "fastmail.com",
      "tutanota.com",
      "pm.me",
      "office365.com",
      "googlemail.com",
      "hey.com",
      "skiff.com",
      "proton.me",
      "edu.br", // Domínios educacionais brasileiros
      "gov.br", // Domínios governamentais brasileiros
      "org.br", // Domínios de organizações brasileiras
      "com.br", // Domínios comerciais brasileiros
    ]

    // Simular um pequeno delay como se estivéssemos fazendo uma verificação real
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Verificar se o domínio está na lista ou se é um domínio corporativo (geralmente mais longo)
    return validDomains.includes(domain) || domain.split(".").length > 2
  } catch (error) {
    console.error("Erro ao verificar domínio de email:", error)
    return false
  }
}

