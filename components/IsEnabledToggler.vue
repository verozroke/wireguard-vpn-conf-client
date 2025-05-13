<template>
  <n-switch
    v-model:value="active"
    size="large"
  >
    <template #checked-icon>
      <Icon
        class="w-10 h-10 text-greeny"
        name="mdi:checkbox-marked-circle"
      />
    </template>
    <template #unchecked-icon>
      <Icon
        class="w-10 h-10 text-greeny"
        name="mdi:close-circle"
      />

    </template>
  </n-switch>
</template>

<script setup lang="ts">
import { Icon } from '#components'
import { NSwitch, useMessage } from 'naive-ui'
import { clientService } from '~/core/services/client.service'

const active = defineModel<boolean>()
const toast = useMessage()

const props = defineProps<{
  clientId: string
}>()

watch(active, async () => {
  if (active.value) {

    // TODO: enable client
    try {
      await clientService.enable({
        clientId: props.clientId
      })
      toast.success('Client enabled successfully')
    } catch {
      toast.error('Client enabled unsuccessfully')

    }
    return
  }

  try {
    await clientService.disable({
      clientId: props.clientId
    })
    toast.success('Client disabled successfully')
  } catch {
    toast.error('Client disabled unsuccessfully')
  }

  console.log('Disable', active.value)

})

</script>

<style scoped></style>