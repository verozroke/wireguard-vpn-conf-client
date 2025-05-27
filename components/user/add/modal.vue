<template>
  <n-modal
    v-model:show="model"
    preset="card"
    class="w-[600px]"
    :title="`Create New User`"
    :bordered="false"
    size="huge"
  >
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
          v-model:value="formValue.user.login"
          clearable
          placeholder="Input your login"
        />
      </NFormItem>

      <NFormItem
        label="Email"
        path="user.email"
      >
        <NInput
          v-model:value="formValue.user.email"
          clearable
          placeholder="Input your email"
        />
      </NFormItem>
      <NFormItem
        label="Password"
        path="user.password"
      >
        <NInput
          v-model:value="formValue.user.password"
          type="password"
          maxlength="32"
          show-count
          clearable
          placeholder="Input your password"
        />
      </NFormItem>
      <NFormItem
        label="Role"
        path="user.role"
      >
        <n-radio-group
          v-model:value="formValue.user.role"
          name="radiobuttongroup1"
        >
          <n-radio-button
            v-for="role in roles"
            :key="role.value"
            :value="role.value"
            :label="role.value"
          />
        </n-radio-group>
      </NFormItem>
    </NForm>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <NButton
          secondary
          strong
          type="error"
          @click="model = false"
        >
          <template #icon>
            <Icon name="mdi:close" />
          </template>
          Cancel
        </NButton>
        <NButton
          secondary
          strong
          type="primary"
          @click="emit('add', formValue.user)"
        >
          <template #icon>
            <Icon name="mdi:plus" />
          </template>
          Create User
        </NButton>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NModal,
  NButton,
  type FormInst,
  NForm,
  NFormItem,
  NInput,
  NRadioGroup,
  NRadioButton,
} from 'naive-ui'

const model = defineModel<boolean>()
const emit = defineEmits(['add'])

const roles = ref([{ value: 'Admin' }, { value: 'Employee' }])

const formRef = ref<FormInst | null>(null)
const size = ref<'small' | 'medium' | 'large'>('medium')
const formValue = ref({
  user: {
    login: '',
    password: '',
    email: '',
    role: 'Employee',
  },
})

const rules = {
  user: {
    login: {
      required: true,
      message: 'Please input your login',
      trigger: 'blur',
    },
    email: {
      required: true,
      message: 'Please input your email',
      trigger: 'blur',
    },
    password: {
      required: true,
      message: 'Please input your password',
      trigger: 'blur',
    },
  },
}
</script>

<style scoped></style>
