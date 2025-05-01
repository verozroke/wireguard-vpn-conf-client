<template>
  <div>User Dashboard</div>
</template>

<script setup>
import { useUserStore } from '~/core/stores/UserStore'
const userStore = useUserStore()

onMounted(async () => {
  await userStore.getUser()
})
</script>

<style lang="scss" scoped></style>
