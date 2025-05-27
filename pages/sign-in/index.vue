<template>
  <div class="bg-slate-50 h-screen w-screen flex flex-col items-center justify-center">
    <div class="flex w-96 pb-5">
      <NuxtLink href="/">
        <NButton quaternary>
          Back
          <template #icon>
            <Icon name="mdi:chevron-left" />
          </template>
        </NButton>
      </NuxtLink>
    </div>
    <div class="flex flex-col w-96 gap-5">
      <h1 class="text-3xl font-bold text-slate-700">Sign In</h1>
      <h3 class="text-base font-medium text-slate-500">
        Make your VPN configuration more comfortable.
      </h3>
      <NForm
        ref="formRef"
        :label-width="80"
        :model="formValue"
        :rules="rules"
        :size="size"
      >
        <NFormItem
          label="Login"
          path="login"
        >
          <NInput
            v-model:value="formValue.login"
            clearable
            placeholder="Input your login"
          />
        </NFormItem>
        <NFormItem
          label="Password"
          path="password"
        >
          <NInput
            v-model:value="formValue.password"
            type="password"
            maxlength="32"
            show-count
            clearable
            placeholder="Input your password"
          />
        </NFormItem>
        <NFormItem>
          <NButton
            type="primary"
            icon-placement="right"
            @click="signIn"
          >
            Sign In
            <template #icon>
              <Icon name="mdi:login" />
            </template>
          </NButton>
        </NFormItem>
      </NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { ref } from 'vue'

import { useUserStore } from '~/core/stores/UserStore'
const toast = useMessage()
const router = useRouter()
const formRef = ref<FormInst | null>(null)
const size = ref<'small' | 'medium' | 'large'>('medium')
const formValue = ref({
  login: '',
  password: '',
})

const userStore = useUserStore()

const rules = {
  user: {
    login: {
      required: true,
      message: 'Please input your password',
      trigger: 'blur',
    },
    password: {
      required: true,
      message: 'Please input your password',
      trigger: ['input', 'blur'],
    },
  },
}
const signIn = (e: MouseEvent) => {
  e.preventDefault()

  formRef.value?.validate(async (err) => {
    if (!err) {
      await SigInRequest()
      return
    }
    toast.error(err.toString())
  })
}

const SigInRequest = async () => {
  try {
    userStore.authLogin = formValue.value.login
    userStore.authPassword = formValue.value.password

    router.push('/verify')
  } catch {
    // console.error(err)
    toast.error('Login was unsuccessfull')
  }
}

onMounted(async () => {
  if (userStore.isAuthenticated || localStorage.getItem('token')) {
    try {
      await userStore.getUser()
      router.push('/subnets')
      return
    } catch {
      return
    }
  }
})
</script>

<style scoped></style>
