<template>
  <n-modal
    v-model:show="model"
    preset="card"
    class="w-[600px]"
    :title="`Edit Subnet (${subnet?.name})`"
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
      <NFormItem label="Subnet Name" path="subnet.name">
        <NInput
          v-model:value="formValue.subnet.name"
          clearable
          placeholder="Input your subnet name"
        />
      </NFormItem>
      <NFormItem label="Subnet IP Address" path="subnet.subnetIp">
        <NInput
          v-model:value="formValue.subnet.subnetIp"
          maxlength="15"
          clearable
          placeholder="Input your subnet IP address"
        />
      </NFormItem>
      <NFormItem label="Subnet Mask (0-32)" path="subnet.subnetMask">
        <NInput
          v-model:value="formValue.subnet.subnetMask"
          :allow-input="onlyAllowNumber"
          maxlength="2"
          clearable
          placeholder="Input your subnet mask"
        >
          <template #prefix> / </template>
        </NInput>
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
          @click="emit('edit', { id: subnet!.id, ...formValue.subnet })"
        >
          <template #icon>
            <Icon name="mdi:pencil" />
          </template>
          Edit Subnet
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
import type { Subnet } from '~/core/types/subnet'

const props = defineProps<{
  subnet: Subnet | null
}>()

const model = defineModel<boolean>()
const emit = defineEmits(['edit'])

const formRef = ref<FormInst | null>(null)
const size = ref<'small' | 'medium' | 'large'>('medium')
const formValue = ref({
  subnet: {
    name: props.subnet?.name,
    subnetIp: props.subnet?.subnetIp,
    subnetMask: props.subnet?.subnetMask.toString(), // (0-32)
  },
})

const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value)
const rules = {
  subnet: {
    name: {
      required: true,
      message: 'Please input your subnet name',
      trigger: 'blur',
    },
    subnetIp: {
      required: true,
      message: 'Please input your subnet IP address',
      trigger: 'blur',
    },
    subnetMask: {
      required: true,
      message: 'Please input your subnet mask',
      trigger: 'blur',
    },
  },
}

watch(
  () => props.subnet,
  (newSubnet) => {
    formValue.value.subnet = {
      name: newSubnet?.name,
      subnetIp: newSubnet?.subnetIp,
      subnetMask: newSubnet?.subnetMask.toString(),
    }
  },
  { immediate: true }
)
</script>

<style scoped></style>
