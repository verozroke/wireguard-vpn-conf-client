import { useMessage } from 'naive-ui'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '~/core/services/auth.service'
import type { User } from '../types/user'

export const useUserStore = defineStore('userStore', () => {
  const user = ref<User | null>(null)

  // const toast = useMessage()
  const router = useRouter()
  const isAuthenticated = ref(false)


  const getUser = async () => {
    if (!localStorage.getItem('token')) {
      router.push('/sign-in')
      return
    }
    try {
      const tokenUser = await authService.me()
      user!.value = tokenUser
      isAuthenticated.value = true

    } catch (error) {
      router.push('/sign-in')
      localStorage.removeItem('token')
      throw new Error('Unauthorized 401')
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      // toast.success('Выход из вашего аккаунта произведен успешно.')
      isAuthenticated.value = false
      router.push('/sign-in')
    } catch (error) {
      // toast.error('Не удалось выйти из вашего аккаунта.')
    }
  }

  return {
    isAuthenticated,
    user,
    getUser,
    logout,
  }
})
