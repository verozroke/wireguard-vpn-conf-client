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
      <h1 class="text-3xl font-bold text-slate-700">2FA</h1>
      <h3 class="text-base font-medium text-slate-500">
        Enter your email, we will send you email <br> with the verification code.
      </h3>
      <NForm
        ref="formRef"
        :label-width="80"
        :model="formValue"
        :rules="rules"
        :size="size"
      >
        <NFormItem
          label="Email"
          path="email"
        >
          <NInput
            v-model:value="formValue.email"
            :disabled="isCodeSended"
            clearable
            placeholder="Input your email"
          />
        </NFormItem>
        <span
          v-if="isCodeSended"
          class="text-sm text-slate-500 hover:underline"
          @click="sendCode"
        >Resend the code.</span>
        <v-otp-input
          v-if="isCodeSended"
          ref="otpInput"
          v-model:value="code"
          input-classes="otp-input"
          input-type="number"
          :num-inputs="6"
          :should-focus-order="true"
        />
        <NFormItem>
          <NButton
            v-if="!isCodeSended"
            type="primary"
            icon-placement="right"
            @click="sendCode"
          >
            Send Code
            <template #icon>
              <Icon name="mdi:login" />
            </template>
          </NButton>

          <NButton
            v-if="isCodeSended"
            type="primary"
            icon-placement="right"
            @click="verifyCode"
          >
            Submit
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
import { authService, type SendCodeBody, type LoginBody, type VerifyCodeBody } from '~/core/services/auth.service'
import { useUserStore } from '~/core/stores/UserStore'
import VOtpInput from "vue3-otp-input";
const toast = useMessage()
const router = useRouter()
const formRef = ref<FormInst | null>(null)
const size = ref<'small' | 'medium' | 'large'>('medium')
const formValue = ref({
  email: '',
})

const userStore = useUserStore()
const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null);
const code = ref('')
const isCodeSended = ref(false)

const rules = {
  user: {
    email: {
      required: true,
      message: 'Please input your email',
      trigger: 'blur',
    },
  },
}
const sendCode = (e: MouseEvent) => {
  e.preventDefault()

  formRef.value?.validate(async (err) => {
    if (!err) {
      await sendCodeRequest()
      return
    }
    toast.error(err.toString())
  })
}

const sendCodeRequest = async () => {
  try {
    const body: SendCodeBody = {
      email: formValue.value.email,
    }

    const message = await authService.sendCode(body)
    isCodeSended.value = true
    // route push
    toast.success(message)
  } catch {
    // console.error(err)
    toast.error('Could not send the code')
  }
}

const verifyCode = async () => {
  try {
    const body: VerifyCodeBody = {
      email: formValue.value.email,
      code: code.value,
    }
    const message = await authService.verifyCode(body)
    toast.success(message)

    const loginBody: LoginBody = {
      login: userStore.authLogin,
      password: userStore.authPassword,
      email: formValue.value.email
    }
    const loginMessage = await authService.login(loginBody)
    userStore.isAuthenticated = true
    toast.success(loginMessage)
    router.push('/subnets')


  } catch {
    toast.error('Could not verify the code')
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

  console.log(userStore.authLogin)
  console.log(userStore.authPassword)
  if (!userStore.authLogin || !userStore.authPassword) {
    router.push('/sign-in')
    return
  }
})
</script>

<style>
.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}
</style>
