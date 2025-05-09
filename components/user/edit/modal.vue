<template>
  <n-modal
    v-model:show="model"
    preset="card"
    class="w-[600px]"
    :title="`Edit User (${user?.login})`"
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
      <NFormItem label="Login" path="user.login">
        <NInput
          v-model:value="formValue.user.login"
          clearable
          placeholder="Input your login"
        />
      </NFormItem>
    </NForm>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <NButton secondary strong type="error" @click="model = false">
          <template #icon>
            <Icon name="mdi:close" />
          </template>
          Cancel
        </NButton>
        <NButton
          secondary
          strong
          type="primary"
          @click="emit('edit', { id: user!.id, ...formValue.user })"
        >
          <template #icon>
            <Icon name="mdi:pencil" />
          </template>
          Edit User
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

const props = defineProps<{
  user: User | null
}>()

const model = defineModel<boolean>()
const emit = defineEmits(['edit'])

const formRef = ref<FormInst | null>(null)
const size = ref<'small' | 'medium' | 'large'>('medium')
const formValue = ref({
  user: {
    login: props.user?.login,
  },
})

const rules = {
  user: {
    login: {
      required: true,
      message: 'Please input your login',
      trigger: 'blur',
    },
  },
}

watch(
  () => props.user,
  (newUser) => {
    formValue.value.user = {
      login: newUser?.login,
    }
  },
  { immediate: true }
)
</script>

<style scoped></style>
