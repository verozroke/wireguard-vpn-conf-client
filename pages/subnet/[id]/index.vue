<template>
  <div class="bg-slate-50 min-h-screen w-screen flex flex-col py-10 px-8">
    <h1 class='text-5xl mb-3 font-bold text-slate-700'>Subnet Clients Dashboard</h1>
    <h2 class='text-3xl mb-3 font-bold text-slate-700'>Current Subnet: HR</h2>
    <h3 class='text-lg font-medium text-slate-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
      praesentium!</h3>
    <ClientAddButton @click="showCreateModal = true" />
    <ClientAddModal
      v-model="showCreateModal"
      @add="createClient"
    />
    <div class="w-full flex flex-col gap-4 py-5">
      <ClientCard
        v-for="client in clients"
        :client="client"
      />

    </div>

  </div>
</template>

<script setup lang="ts">
const route = useRoute()
import type { Client } from '~/core/types/subnet';

const showCreateModal = ref(false)

const clients = ref<Client[]>([
  {
    id: '1',
    name: 'Askhat Takayev',
    clientIp: '10.7.3.1',
    isEnabled: true,
    publicKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
    privateKeyRef: '/keys/clients/1',
    subnetId: 1,
  },
  {
    id: '2',
    name: 'Artem Kovyazin',
    clientIp: '10.7.3.2',
    isEnabled: true,
    publicKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
    privateKeyRef: '/keys/clients/2',
    subnetId: 1,
  },
  {
    id: '3',
    name: 'Vladislav Khan',
    clientIp: '10.7.3.3',
    isEnabled: false,
    publicKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
    privateKeyRef: '/keys/clients/3',
    subnetId: 1,
  },
])


const createClient = (client: Client) => {
  // FIXME: ?
  showCreateModal.value = false
}
</script>

<style scoped></style>