<template>
  <n-modal
    v-model:show="model"
    preset="card"
    class="w-[600px]"
    :title="`Create New Client`"
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
        label="Client Name"
        path="client.name"
      >
        <NInput
          v-model:value="formValue.client.name"
          clearable
          placeholder="Input your client name"
        />
      </NFormItem>
      <NFormItem
        label="Client IP Address"
        path="client.clientIp"
      >
        <NInput
          v-model:value="formValue.client.clientIp"
          maxlength="15"
          clearable
          placeholder="Input your client IP address"
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
          @click="emit('add')"
        >
          <template #icon>
            <Icon name="mdi:plus" />
          </template>
          Create Client
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

const model = defineModel<boolean>()
const emit = defineEmits(['add'])

const formRef = ref<FormInst | null>(null)
const size = ref<'small' | 'medium' | 'large'>('medium')
const formValue = ref({
  client: {
    name: '',
    clientIp: '',
  },
})

const rules = {
  subnet: {
    name: {
      required: true,
      message: 'Please input your client name',
      trigger: 'blur',
    },
    clientIp: {
      required: true,
      message: 'Please input your client IP address',
      trigger: 'blur',
    },
  },
}
</script>

<style scoped></style>
