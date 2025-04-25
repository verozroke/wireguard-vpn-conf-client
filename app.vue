<script setup lang="ts">
import { NDialogProvider, NModalProvider, NMessageProvider, NConfigProvider } from 'naive-ui';

</script>

<template>
  <div>
    <n-config-provider>
      <n-message-provider>
        <n-modal-provider>
          <n-dialog-provider>
            <NuxtPage />
          </n-dialog-provider>
        </n-modal-provider>
      </n-message-provider>
    </n-config-provider>

  </div>

</template>
