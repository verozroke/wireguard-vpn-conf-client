<script setup lang="ts">
import { NDialogProvider, NModalProvider } from 'naive-ui';

</script>

<template>
  <div>
    <n-modal-provider>
      <n-dialog-provider>
        <NuxtPage />
      </n-dialog-provider>
    </n-modal-provider>
  </div>

</template>
