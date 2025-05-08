<template>
  <div class="bg-slate-50 min-h-screen flex flex-col py-10 px-8 items-center">
    <h1 class="text-5xl mb-3 font-bold text-slate-700">Your VPN Clients</h1>
    <h3 class="text-lg mb-5 font-medium text-slate-500">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
      praesentium!
    </h3>
    <div
      class="py-5 px-2 gap-5 flex items-center mx-auto flex-col w-full min-w-[512px] max-w-[768px]"
    >
      <template v-if="clients.length > 0">
        <ClientCard v-for="client in clients" :key="client.id" :client />
      </template>
      <template v-else>
        <Icon
          class="w-52 h-52 text-slate-400"
          name="mdi:emoticon-sad-outline"
        />
        <h1 class="text-slate-400 text-4xl">You have no clients.</h1>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { clientService } from '~/core/services/client.service'
import { useUserStore } from '~/core/stores/UserStore'
import type { Client } from '~/core/types/client'
const userStore = useUserStore()
const toast = useMessage()
const clients = ref<Client[]>([])

const getClients = async () => {
  try {
    if (!userStore.user) return
    const userId = userStore.user.id
    const data = await clientService.myClients(userId)
    clients.value = data
  } catch {
    toast.error('Could not fetch clients')
  }
}

onMounted(async () => {
  await userStore.getUser()
  await getClients()
})
</script>

<style lang="scss" scoped></style>
