<template>
  <n-modal
    v-model:show="model"
    preset="card"
    class="w-[600px]"
    :title="`Change password (${user?.login})`"
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
        label="Old Password"
        path="user.oldPassword"
      >
        <NInput
          v-model:value="formValue.user.oldPassword"
          type="password"
          maxlength="32"
          show-count
          clearable
          placeholder="Input your old password"
        />
      </NFormItem>
      <NFormItem
        label="New Password"
        path="user.newPassword"
      >
        <NInput
          v-model:value="formValue.user.newPassword"
          type="password"
          maxlength="32"
          show-count
          clearable
          placeholder="Input your new password"
        />
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
          @click="emit('change-password', { id: user!.id, ...formValue.user })"
        >
          <template #icon>
            <Icon name="mdi:pencil" />
          </template>
          Change Password
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
} from 'naive-ui'
import type { User } from '~/core/types/user'

defineProps<{
  user: User | null
}>()

const model = defineModel<boolean>()
const emit = defineEmits(['change-password'])

const formRef = ref<FormInst | null>(null)
const size = ref<'small' | 'medium' | 'large'>('medium')
const formValue = ref({
  user: {
    oldPassword: '',
    newPassword: '',
  },
})

const rules = {
  user: {
    oldPassword: {
      required: true,
      message: 'Please input your login',
      trigger: 'blur',
    },
    newPassword: {
      required: true,
      message: 'Please input your login',
      trigger: 'blur',
    },
  },
}

</script>

<style scoped></style>
