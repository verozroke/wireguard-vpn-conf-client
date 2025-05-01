<template>
  <div>
    User Dashboard
  </div>
</template>

<script setup>

const userStore = useUserStore()
import { useUserStore } from '~/core/stores/UserStore';

onMounted(async () => {
  await userStore.getUser()
})
</script>

<style lang="scss" scoped></style>