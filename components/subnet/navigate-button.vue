<template>
  <NuxtLink :href='`/subnets/${subnetId}`'>
    <NButton
      icon-placement="right"
      secondary
      strong
      type="primary"
    >
      <template #icon>
        <Icon name="mdi:arrow-right" />
      </template>
      Navigate
    </NButton>
  </NuxtLink>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui';

defineProps<{
  subnetId: string
}>()
</script>

<style scoped></style>