<template>
  <div class="bg-slate-50 h-screen w-screen flex flex-col items-center justify-center">
    <h1 class='text-3xl font-bold text-slate-700 w-96 text-center'>Welcome to VPN Configuration Platform!</h1>
    <h3 class='text-base my-2 font-medium text-center text-slate-500'>Lorem ipsum dolor, sit amet consectetur
      adipisicing.</h3>
    <NuxtLink href="/sign-in">
      <NButton
        type="primary"
        icon-placement="right"
        class='my-2'
      >
        Sign In
        <template #icon>
          <Icon name="mdi:arrow-right" />
        </template>
      </NButton>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
</script>

<style scoped></style>