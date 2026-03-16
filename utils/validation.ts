export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateFullName(name: string): boolean {
  return name.trim().length >= 2
}
