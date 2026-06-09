export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  blocked: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
}
