export * from './database'

export interface AuthError {
  message: string
  status?: number
}

export interface AuthResult {
  success: boolean
  error?: string
  redirectTo?: string
}

export interface FormState {
  error?: string
  success?: string
  pending?: boolean
}
