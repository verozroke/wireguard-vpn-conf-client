<template>
  <n-card
    :title="() => CardTitle"
    embedded
    class="max-w-full shadow-md hover:shadow-none transition-all rounded-md bg-slate-400"
  >
    <template #header-extra>
      <ClientEditModal
        v-model="showModal"
        :client="client"
        @edit="editClient"
      />
      <div class="flex items-center gap-2">
        <!-- <ClientEnableToggler v-model="client.isEnabled" /> -->
        <ClientEditButton @click="showModal = true" />
        <!-- <ClientDeleteButton @click="deleteClient" /> -->
      </div>
    </template>
    <n-tag
      class="px-4"
      type="success"
    >
      HR
      <template #icon>
        <Icon name="line-md:hash" />
      </template>
    </n-tag>
    <br>
    <span class="font-medium text-slate-700 leading-loose"><b>IP-address:</b> {{ client.clientIp }}/24</span>
    <br>
    <!-- <span class="font-medium text-slate-700 leading-loose"><b>Public Key:</b>
      <div class="truncate w-64">{{ client.publicKey }}</div>
    </span>
    <span class="font-medium text-slate-700 leading-loose"><b>Private Key Reference:</b> {{ client.privateKeyRef
    }}</span> -->
    <!-- <br> -->
    <span class="font-medium text-slate-700">Download configuration for this clients.</span>
    <template #footer>
      <div class="flex w-full gap-2 justify-end">
        <NButton
          class="w-fit my-4"
          type="primary"
          @click="downloadConfig"
        >
          Download Configuration
          <template #icon>
            <Icon name="mdi:download" />
          </template>
        </NButton>
        <QRCodeModal
          v-model="qrCodeModal"
          :qrcode="qrCodeImage"
        />
        <NButton
          class="w-fit my-4"
          type="primary"
          @click="getQRCode"
        >
          Generate QR Code
          <template #icon>
            <Icon name="mdi:qrcode" />
          </template>
        </NButton>
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import type { Client } from '~/core/types/client'
import { NCard, NButton, NTag, useMessage } from 'naive-ui'
import { clientService, type ClientEditBody } from '~/core/services/client.service';
// const dialog = useDialog()
const showModal = ref(false)
const qrCodeModal = ref(false)
const toast = useMessage()
const props = defineProps<{
  client: Client
}>()

const qrCodeImage = ref<string>('')

let CardTitle = h('div', {
  innerHTML: `
    <div class="flex gap-2 items-center">
      <img src="https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png" class="w-8 h-8 rounded-full object-cover"/> 
      <span>${props.client.name}</span>
    </div>
  `,
})

const editClient = async (formInput: { name: string }) => {
  try {
    const clientId = props.client.id
    const body: ClientEditBody = {
      name: formInput.name,
      clientIp: props.client.clientIp,
    }


    console.log(body)
    const newClient = await clientService.edit(clientId, body, 'name')
    CardTitle = h('div', {
      innerHTML: `
        <div class="flex gap-2 items-center">
          <img src="https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png" class="w-8 h-8 rounded-full object-cover"/> 
          <span>${newClient.name}</span>
        </div>
      `,
    })
    toast.success('Client edited successfully')
    showModal.value = false
  } catch {
    toast.error('Could not edit client.')
  }
}


const downloadConfig = async () => {
  try {
    const clientId = props.client.id
    const message = await clientService.configuration(clientId)
    toast.success(message)
  } catch {
    toast.error('Could not download configuration.')

  }
}

const getQRCode = async () => {
  try {
    const clientId = props.client.id
    const qrcode = await clientService.qrcode(clientId)
    qrCodeImage.value = `data:image/png;base64,${qrcode}`
    qrCodeModal.value = true
    toast.success('Scan this QR Code to get the configuration.')
  } catch {
    toast.error('Could not download configuration QR Code.')

  }
}

// const deleteClient = () => {
//   dialog.warning({
//     title: 'Are you sure?',
//     content: 'Do you want to delete this client?',
//     positiveText: `Delete Client (${props.client.name})`,
//     negativeText: 'Cancel',
//     draggable: true,
//     onPositiveClick: () => {
//       console.log('delete')
//     },
//     onNegativeClick: () => {
//       console.log('delete terminated')
//     },
//   })
// }
</script>

<style scoped></style>
