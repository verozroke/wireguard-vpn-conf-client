import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '~/core/services/auth.service'
import type { User } from '../types/user'
import type { Role } from '../enums/Role'

export const useUserStore = defineStore('userStore', () => {
  const user = ref<User | null>(null)

  // const toast = useMessage()
  const router = useRouter()
  const isAuthenticated = ref(false)

  const authLogin = ref('')
  const authPassword = ref('')

  const getUser = async () => {
    if (!localStorage.getItem('token')) {
      router.push('/sign-in')
      return
    }
    try {
      const tokenUser = await authService.me()
      user!.value = tokenUser
      isAuthenticated.value = true
      checkAccessRedirect()
    } catch {
      router.push('/sign-in')
      localStorage.removeItem('token')
      throw new Error('Unauthorized 401')
    }
  }

  const logout = async () => {
    try {
      const message = await authService.logout()
      // toast.success('Выход из вашего аккаунта произведен успешно.')
      isAuthenticated.value = false
      router.push('/sign-in')
      return message
    } catch {
      // toast.error('Не удалось выйти из вашего аккаунта.')
    }
  }

  const isAdmin = (): boolean =>
    user.value?.role === ('Admin' as unknown as Role)

  const checkAccessRedirect = () => {
    const currentPath = window.location.pathname

    if (isAdmin() && currentPath === '/user-dashboard') {
      router.push('/subnets')
    } else if (!isAdmin() && currentPath !== '/user-dashboard') {
      router.push('/user-dashboard')
    }
  }

  return {
    isAuthenticated,
    user,
    getUser,
    logout,
    isAdmin,
    authLogin,
    authPassword
  }
})
