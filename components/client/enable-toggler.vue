<template>
  <n-switch v-model:value="model" size="small">
    <template #checked> enabled </template>
    <template #unchecked> disabled </template>
  </n-switch>
</template>

<script setup lang="ts">
import { NSwitch } from 'naive-ui'
const model = defineModel<boolean>()
</script>

<style scoped></style>
