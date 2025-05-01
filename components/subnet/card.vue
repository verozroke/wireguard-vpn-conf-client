<template>
  <n-card
    :title="subnet.name"
    embedded
    class="max-w-96 shadow-md rounded-md bg-slate-100 hover:bg-slate-200 hover:shadow-none transition-all"
  >
    <template #header-extra>
      <SubnetEditModal
        v-model="showModal"
        :subnet="subnet"
        @edit="editSubnet"
      />
      <div class="flex gap-2">
        <SubnetEditButton @click="showModal = true" />
        <SubnetDeleteButton @click="deleteSubnet" />
      </div>
    </template>

    <span class="font-medium text-slate-700"
      ><b>IP-address:</b> {{ subnet.subnetIp }}/{{ subnet.subnetMask }}</span
    >
    <br />
    <span class="font-medium text-slate-700"
      >Navigate to subnet page to view more information about the current
      subnet.</span
    >
    <template #footer>
      <div class="flex w-full justify-end">
        <SubnetNavigateButton :subnet-id="subnet.id" />
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import type { Subnet } from '~/core/types/subnet'
import { NCard, useDialog } from 'naive-ui'

const props = defineProps<{
  subnet: Subnet
}>()

const showModal = ref(false)
const dialog = useDialog()

const editSubnet = () => {
  showModal.value = false
  console.log('edited')
}

const deleteSubnet = () => {
  dialog.warning({
    title: 'Are you sure?',
    content: 'Do you want to delete your subnet?',
    positiveText: `Delete Subnet (${props.subnet.name})`,
    negativeText: 'Cancel',
    draggable: true,
    onPositiveClick: () => {
      console.log('delete')
    },
    onNegativeClick: () => {
      console.log('delete terminated')
    },
  })
}
</script>

<style scoped></style>
