<template>
  <n-card
    :title="() => CardTitle"
    embedded
    class="max-w-[700px] shadow-md hover:shadow-none transition-all rounded-md bg-slate-100"
  >

    <template #header-extra>
      <ClientEditModal
        v-model="showModal"
        :client="client"
        @edit="editClient"
      />
      <div class="flex items-center gap-2">
        <ClientEnableToggler v-model='client.isEnabled' />
        <ClientEditButton @click="showModal = true" />
        <ClientDeleteButton @click="deleteClient" />
      </div>
    </template>
    <n-tag
      class='px-4'
      type="success"
    >
      HR
      <template #icon>
        <Icon name="line-md:hash" />
      </template>
    </n-tag> <br>
    <span class="font-medium text-slate-700 leading-loose"><b>IP-address:</b> {{ client.clientIp }}/24</span> <br>
    <span class="font-medium text-slate-700 leading-loose"><b>Public Key:</b>
      <div class="truncate w-64">{{
        client.publicKey
      }}</div>
    </span>
    <span class="font-medium text-slate-700 leading-loose"><b>Private Key Reference:</b> {{ client.privateKeyRef
    }}</span>
    <br>

    <br>
    <span class="font-medium text-slate-700">Manage this client account in the current subnet as may you want.</span>
    <template #footer>
      <div class="flex w-full gap-2 justify-end">
        <NButton
          class="w-fit my-4"
          type="primary"
        >
          Download Configurations
          <template #icon>
            <Icon name="mdi:download" />
          </template>
        </NButton>
        <NButton
          class="w-fit my-4"
          type="primary"
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
import type { Client } from '~/core/types/subnet';
import { NCard, NButton, NTag, useDialog } from 'naive-ui';
const dialog = useDialog()
const showModal = ref(false)


const props = defineProps<{
  client: Client
}>()

const CardTitle = h('div', {
  innerHTML: `
    <div class="flex gap-2 items-center">
      <img src="https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png" class="w-8 h-8 rounded-full object-cover"/> 
      <span>${props.client.name}</span>
    </div>
  `
})

const editClient = () => {
  showModal.value = false
  console.log('edited')
}

const deleteClient = () => {
  dialog.warning({
    title: 'Are you sure?',
    content: 'Do you want to delete this client?',
    positiveText: `Delete Client (${props.client.name})`,
    negativeText: 'Cancel',
    draggable: true,
    onPositiveClick: () => {
      console.log('delete')
    },
    onNegativeClick: () => {
      console.log('delete terminated')
    }
  })
}



</script>

<style scoped></style>