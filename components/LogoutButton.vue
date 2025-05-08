<template>
  <n-button
    ghost
    color="#fff"
    icon-placement="left"
    @click="logout"
  >
    <template #icon>
      <Icon
        class="w-10 h-10"
        name="mdi:logout"
      />
    </template>
    Logout
  </n-button>
</template>

<script setup lang="ts">
import { Icon } from '#components'
import { NButton, useMessage } from 'naive-ui';
import { useUserStore } from '~/core/stores/UserStore';

const toast = useMessage()
const userStore = useUserStore()

const logout = async () => {
  const message = await userStore.logout()
  toast.success(message ? message : 'Logout unsuccessfull')
  reloadNuxtApp()
}
</script>

<style scoped></style>