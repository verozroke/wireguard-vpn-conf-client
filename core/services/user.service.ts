import axios from 'axios'
import type { User } from '../types/user'

const config = useRuntimeConfig()

const ROUTE_SEGMENT = 'user'
const BASE_URL = config.public.API_URL
  ? `${config.public.API_URL}/${ROUTE_SEGMENT}`
  : ''

export type UserCreateBody = {
  login: string
  password: string
  is_admin: boolean
}

export type UserEditBody = {
  login: string
}

class UserService {
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

  async users(): Promise<User[]> {
    const { data } = await axios.get<User[]>(`${this.BASE_URL}/`, {
      headers: this.getAuthHeaders(),
    })

    return data
  }

  async delete(userId: string): Promise<string> {
    await axios.delete(`${this.BASE_URL}/${userId}`, {
      headers: this.getAuthHeaders(),
    })

    return 'User was deleted successfully'
  }

  async create(body: UserCreateBody): Promise<User> {
    const { data } = await axios.post<User>(`${this.BASE_URL}/register`, body, {
      headers: this.getAuthHeaders(),
    })

    return data
  }

  async edit(userId: string, body: UserEditBody): Promise<User> {
    const { data } = await axios.put<User>(
      `${this.BASE_URL}/${userId}/login`,
      {
        login: body.login,
      },
      {
        headers: this.getAuthHeaders(),
      }
    )

    return data
  }
}

function createUserService(API_URL: string): UserService {
  return new UserService(API_URL)
}

export const userService = createUserService(BASE_URL)
