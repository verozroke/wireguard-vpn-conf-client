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
      <NFormItem label="Client Name" path="client.name">
        <NInput
          v-model:value="formValue.client.name"
          clearable
          placeholder="Input your client name"
        />
      </NFormItem>
      <NFormItem label="Client IP Address" path="client.clientIp">
        <NInput
          v-model:value="formValue.client.clientIp"
          maxlength="15"
          clearable
          placeholder="Input your client IP address"
        />
      </NFormItem>
      <NFormItem label="Client's Subnet" path="client.subnetId">
        <n-select
          v-model:value="formValue.client.subnetId"
          filterable
          tag
          :options="subnetOptions"
        />
      </NFormItem>
      <NFormItem label="Client's User" path="client.userId">
        <n-select
          v-model:value="formValue.client.userId"
          filterable
          tag
          :options="userOptions"
        />
      </NFormItem>
      <!-- form item with select of subnets -->
      <!-- form item with select of users (who is employee) TODO: make the endpoint for the users that will fetch only the users with role of employee -->
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
          @click="emit('add', formValue.client)"
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
  NSelect,
  useMessage,
} from 'naive-ui'
import { subnetService } from '~/core/services/subnet.service'
import { userService } from '~/core/services/user.service'

export type SelectOptions = {
  label: string
  value: string
}

const model = defineModel<boolean>()
const emit = defineEmits(['add'])

const toast = useMessage()
const formRef = ref<FormInst | null>(null)
const size = ref<'small' | 'medium' | 'large'>('medium')
const formValue = ref({
  client: {
    name: '',
    clientIp: '',
    userId: '',
    subnetId: '',
  },
})

const rules = {
  client: {
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

const subnetOptions = ref<SelectOptions[]>([])
const userOptions = ref<SelectOptions[]>([])

async function getSubnetOptions() {
  try {
    const subnetData = await subnetService.subnets()
    subnetOptions.value = subnetData.map((subnet) => ({
      label: `${subnet.name} | ${subnet.subnetIp}/${subnet.subnetMask}`,
      value: subnet.id,
    }))
  } catch {
    toast.error('Could not fetch subnets for the options.')
  }
}

async function getUserOptions() {
  try {
    const userData = await userService.employees()
    userOptions.value = userData.map((user) => ({
      label: `${user.login} | ${user.role}`,
      value: user.id,
    }))
  } catch {
    toast.error('Could not fetch users for the options.')
  }
}

watch(model, () => {
  if (
    !model.value ||
    (subnetOptions.value.length > 0 && userOptions.value.length > 0)
  )
    return
  Promise.all([getSubnetOptions(), getUserOptions()])
})
</script>

<style scoped></style>
