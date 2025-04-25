<template>
  <div class="bg-slate-50 min-h-screen w-screen flex flex-col py-10 px-8">
    <h1 class='text-5xl mb-3 font-bold text-slate-700'>Admin Dashboard</h1>
    <h3 class='text-lg font-medium text-slate-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
      praesentium!</h3>
    <div class="w-full flex gap-4 flex-wrap py-5">
      <n-data-table
        size="large"
        :columns="columns"
        :data="subnets"
        :pagination="paginationReactive"
        :row-key="rowKey"
        @update:checked-row-keys="handleCheck"
      />
      <!-- <SubnetAddCard @click="showCreateModal = true" /> -->
      <!-- <SubnetAddModal -->
      <!-- v-model="showCreateModal" -->
      <!-- @add="createSubnet" -->
      <!-- /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, useMessage, type DataTableColumns, NDataTable, type DataTableRowKey } from 'naive-ui';
import type { RowData } from 'naive-ui/es/data-table/src/interface';
import { Fragment } from 'vue/jsx-runtime';
import { useUserStore } from '~/core/stores/UserStore';
import type { Subnet } from '~/core/types/subnet';

const showCreateModal = ref(false)
const userStore = useUserStore()
const toast = useMessage()
const router = useRouter()

const checkedRowKeys = ref<DataTableRowKey[]>([])
const rowKey = (row: RowData) => row.id
function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeys.value = rowKeys
}

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
    subnetIp: '12.7.4.0',
    subnetMask: 25
  },
  {
    id: '3',
    name: 'Accounting',
    subnetIp: '15.7.5.0',
    subnetMask: 26
  },
  {
    id: '4',
    name: 'Accounting2',
    subnetIp: '15.7.5.0',
    subnetMask: 26
  },
  {
    id: '5',
    name: 'Accounting3',
    subnetIp: '15.7.5.0',
    subnetMask: 26
  },
  {
    id: '6',
    name: 'Accounting4',
    subnetIp: '15.7.5.0',
    subnetMask: 26
  },
])
const paginationReactive = reactive({
  page: 2,
  pageSize: 5,
  showSizePicker: true,
  pageSizes: [3, 5, 7],
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  }
})

function createColumns({
  play
}: {
  play: (row: Subnet) => void
}): DataTableColumns<Subnet> {
  return [
    {
      type: 'selection',
      options: [
        'all',
        'none'
      ]
    },
    {
      title: 'ID',
      key: 'id',
      resizable: true
    },
    {
      title: 'Name',
      key: 'name',
      sorter: (row1, row2) => row1.name > row2.name,
      defaultFilterOptionValues: [],
      filterOptions: subnets.value.map(subnet => ({
        label: subnet.name,
        value: subnet.name
      })),
      filter(value, row) {
        return !!~row.name.indexOf(String(value))
      },
      resizable: true
    },
    {
      title: 'Subnet IP',
      key: 'subnetIp',
      sorter: (row1, row2) => row1.subnetIp > row2.subnetIp,
      filterOptions: subnets.value.map(subnet => ({
        label: subnet.subnetIp,
        value: subnet.subnetIp
      })),
      filter(value, row) {
        return !!~row.subnetIp.indexOf(String(value))
      },
      resizable: true
    },
    {
      title: 'Subnet Mask',
      key: 'subnetMask',
      sorter: (row1, row2) => row1.subnetMask - row2.subnetMask,
      filterOptions: subnets.value.map(subnet => ({
        label: subnet.subnetMask.toString(),
        value: subnet.subnetMask.toString()
      })),
      filter(value, row) {
        return !!~row.subnetMask.toString().indexOf(String(value))
      },
      resizable: true
    },
    {
      title: 'Action',
      key: 'actions',
      render(row) {
        return h(Fragment, {}, [
          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              color: '#18a058',
              onClick: () => play(row)
            },
            { default: () => 'Go To' }
          ),
          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              color: '#f0a020',
              style: { marginLeft: '8px' }, // чтобы кнопки не слипались
              onClick: () => console.log('Another action', row)
            },
            { default: () => 'Edit' }
          ),
          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              color: '#d03050',
              style: { marginLeft: '8px' },
              onClick: () => console.log('Delete action', row)
            },
            { default: () => 'Delete' }
          )
        ])
      },
      resizable: true
    }
  ]
}



const columns = createColumns({
  play(row: Subnet) {
    router.push(`/subnet/${row.id}`)
  }
})

const createSubnet = (subnet: Omit<Subnet, 'id'>) => {
  const nextId = (parseInt(subnets.value[subnets.value.length - 1].id) + 1).toString()
  subnets.value.push({ id: nextId, ...subnet })
  showCreateModal.value = false
  // TODO: createSubnet
}

const getSubnets = async () => {
  // TODO: getSubnets
}


onMounted(async () => {
  await userStore.getUser()
  await getSubnets()
})

</script>

<style scoped></style>