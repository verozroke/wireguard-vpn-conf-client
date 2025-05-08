<script setup lang="ts">
import {
  NDialogProvider,
  NModalProvider,
  NMessageProvider,
  NConfigProvider,
} from 'naive-ui'
</script>

<template>
  <n-config-provider>
    <n-message-provider>
      <n-modal-provider>
        <n-dialog-provider>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </n-dialog-provider>
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>
