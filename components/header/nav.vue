<template>
  <div
    class="text-white h-12 flex items-center w-full px-5 py-2 justify-between bg-greeny"
  >
    <h1 class="text-bold text-xl leading-5 tracking-wide">
      VPN Configuration Platform.
    </h1>
    <LogoutButton v-if="userStore.isAuthenticated" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/core/stores/UserStore'

const userStore = useUserStore()
</script>

<style scoped></style>
