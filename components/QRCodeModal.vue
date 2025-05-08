<template>
  <n-modal
    v-model:show="model"
    preset="card"
    class="w-[600px]"
    :title="`Scan QR Code to get configurations`"
    :bordered="false"
    size="huge"
  >
    <img class="mx-auto" :src="qrcode" >
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <NButton secondary strong type="error" @click="model = false">
          <template #icon>
            <Icon name="mdi:close" />
          </template>
          Cancel
        </NButton>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NButton } from 'naive-ui'

defineProps<{
  qrcode: string
}>()
const model = defineModel<boolean>()
</script>

<style scoped></style>
