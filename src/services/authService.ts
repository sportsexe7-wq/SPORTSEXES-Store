import type { User } from '@/types'
import { delay } from './api'
import { mockUser } from '@/data/mock/user'

export interface LoginCredentials {
  email: string
  password: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await delay(500)
    if (credentials.email && credentials.password.length >= 6) {
      return { user: mockUser, token: 'mock-jwt-token' }
    }
    throw new Error('Invalid credentials')
  },

  async getProfile(): Promise<User> {
    await delay()
    return mockUser
  },
}
