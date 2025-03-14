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
      <h1 class='text-3xl font-bold text-slate-700'>Sign In</h1>
      <h3 class='text-base font-medium text-slate-500'>Lorem ipsum dolor, sit amet consectetur adipisicing.
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
          path="user.login"
        >
          <NInput
            clearable
            placeholder="Input your login"
          />
        </NFormItem>
        <NFormItem
          label="Password"
          path="user.password"
        >
          <NInput
            type='password'
            maxlength="24"
            show-count
            clearable
            placeholder="Input your password"
          />
        </NFormItem>
        <NFormItem>
          <NButton
            type="primary"
            @click="signIn"
            icon-placement="right"
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
import { NButton, NForm, NFormItem, NInput } from 'naive-ui'
import { ref } from 'vue'

const router = useRouter()
const formRef = ref<FormInst | null>(null)
const size = ref<'small' | 'medium' | 'large'>('medium')
const formValue = ref({
  user: {
    name: '',
    age: ''
  },
  phone: ''
})
const rules = {
  user: {
    login: {
      required: true,
      message: 'Please input your password',
      trigger: 'blur'
    },
    password: {
      required: true,
      message: 'Please input your password',
      trigger: ['input', 'blur']
    }
  },
}
const signIn = (e: MouseEvent) => {
  e.preventDefault()
  router.push('/dashboard')

  formRef.value?.validate((errors) => {
    if (!errors) {
    }
    else {
      console.log(errors)
    }
  })
}
</script>

<style scoped></style>