import axios from 'axios'
import type { User } from '../types/user'

const config = useRuntimeConfig()
export type LoginBody = {
  login: string
  password: string
  email: string
}

export type LoginResponse = {
  access_token: string
  token_type: string
}

export type ChangePasswordBody = {
  userId: string
  oldPassword: string
  newPassword: string
}

export type SendCodeBody = {
  email: string
}

export type VerifyCodeBody = {
  email: string
  code: string
}

export type BaseResponse = { status: string }

export type ChangePasswordResponse = BaseResponse & { userId: string }

const ROUTE_SEGMENT = 'user'
const BASE_URL = config.public.API_URL
  ? `${config.public.API_URL}/${ROUTE_SEGMENT}`
  : ''

class AuthService {
  private BASE_URL: string

  constructor(BASE_URL: string) {
    this.BASE_URL = BASE_URL
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  async login(body: LoginBody): Promise<string> {
    const { data } = await axios.post<LoginResponse>(
      `${this.BASE_URL}/login`,
      body,
      {
        headers: {
          'Content-Encoding': 'application/json',
        },
      }
    )

    localStorage.setItem('token', data.access_token)

    return 'Login is successful.'
  }

  async logout(): Promise<string> {
    localStorage.removeItem('token')
    return 'Logout successfully'
  }

  async me(): Promise<User> {
    const { data } = await axios.get<User>(`${this.BASE_URL}/me`, {
      headers: this.getAuthHeaders(),
    })

    return data
  }

  async changePassword(body: ChangePasswordBody): Promise<string> {
    await axios.put<ChangePasswordResponse>(
      `${this.BASE_URL}/change-password`,
      body,
      {
        headers: this.getAuthHeaders(),
      }
    )

    return 'Password changed successfully.'
  }

  async sendCode(body: SendCodeBody): Promise<string> {
    const { data } = await axios.post(
      `${this.BASE_URL}/send-email`,
      body,
      {
        headers: {
          'Content-Encoding': 'application/json',
        },
      }
    )
    return data.message
  }

  async verifyCode(body: VerifyCodeBody): Promise<string> {
    const { data } = await axios.post(
      `${this.BASE_URL}/verify-email`,
      body,
      {
        headers: {
          'Content-Encoding': 'application/json',
        },
      }
    )
    return data.message
  }
}

function createAuthService(API_URL: string): AuthService {
  return new AuthService(API_URL)
}

export const authService = createAuthService(BASE_URL)
