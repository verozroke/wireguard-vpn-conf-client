<template>
  <div class="bg-slate-50 h-screen w-screen flex flex-col py-10 px-8">
    <h1 class='text-5xl mb-3 font-bold text-slate-700'>Admin Dashboard</h1>
    <h3 class='text-lg font-medium text-slate-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
      praesentium!</h3>
    <div class="w-full flex gap-4 flex-wrap py-5">
      <SubnetCard
        v-for="subnet in subnets"
        :subnet="subnet"
      />
      <SubnetAddCard @click="showCreateModal = true" />
      <SubnetAddModal
        v-model="showCreateModal"
        @add="createSubnet"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Subnet } from '~/core/types/subnet';

const showCreateModal = ref(false)

const subnets = ref<Subnet[]>([
  {
    id: '1',
    name: 'HR',
    subnetIp: '10.7.3.0',
    subnetMask: 24
  },
  {
    id: '2',
    name: 'IT',
    subnetIp: '10.7.4.0',
    subnetMask: 24
  },
  {
    id: '3',
    name: 'Accounting',
    subnetIp: '10.7.5.0',
    subnetMask: 24
  },
])


const createSubnet = (subnet: Omit<Subnet, 'id'>) => {
  const nextId = (parseInt(subnets.value[subnets.value.length - 1].id) + 1).toString()
  subnets.value.push({ id: nextId, ...subnet })
  showCreateModal.value = false
}

</script>

<style scoped></style>