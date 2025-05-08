<template>
  <dashboard-panel>
    <div class="bg-slate-50 min-h-screen flex flex-col py-10 px-8">
      <h1 class="text-5xl mb-3 font-bold text-slate-700">Subnets</h1>
      <h3 class="text-lg mb-5 font-medium text-slate-500">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
        praesentium!
      </h3>
      <subnet-add-button @click="showCreateModal = true" />
      <SubnetAddModal v-model="showCreateModal" @add="createSubnet" />
      <SubnetEditModal
        v-model="showEditModal"
        :subnet="currentEditSubnet"
        @edit="editSubnet"
      />
      <div class="w-full flex gap-4 flex-wrap py-5">
        <n-data-table
          size="large"
          :columns="columns"
          :data="subnets"
          :pagination="paginationReactive"
          :row-key="rowKey"
        />
        <!-- <SubnetAddCard @click="showCreateModal = true" /> -->
        <!-- <SubnetAddModal -->
        <!-- v-model="showCreateModal" -->
        <!-- @add="createSubnet" -->
        <!-- /> -->
      </div>
    </div>
  </dashboard-panel>
</template>

<script setup lang="ts">
import {
  NButton,
  type DataTableColumns,
  NDataTable,
  useMessage,
} from 'naive-ui'
import type { RowData } from 'naive-ui/es/data-table/src/interface'
import { Fragment } from 'vue/jsx-runtime'
import {
  subnetService,
  type SubnetCreateBody,
  type SubnetEditBody,
} from '~/core/services/subnet.service'
import { useUserStore } from '~/core/stores/UserStore'
import type { Subnet } from '~/core/types/subnet'

const showCreateModal = ref(false)
const showEditModal = ref(false)
const userStore = useUserStore()
const router = useRouter()
const toast = useMessage()
const rowKey = (row: RowData) => row.id

const subnets = ref<Subnet[]>([])

const currentEditSubnet = ref<Subnet | null>(null)

const paginationReactive = reactive({
  page: 1,
  pageSize: 5,
  showSizePicker: true,
  pageSizes: [3, 5, 7],
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  },
})

type DataTableColumnMethods = {
  goTo: (row: Subnet) => void
  deleteSubnet: (row: Subnet) => Promise<void>
  editModalHandler: (row: Subnet) => void
}

const subnetNameFilterOptions = computed(() =>
  subnets.value.map((subnet) => ({
    label: subnet.name,
    value: subnet.name,
  }))
)

const subnetIpFilterOptions = computed(() =>
  subnets.value.map((subnet) => ({
    label: subnet.subnetIp,
    value: subnet.subnetIp,
  }))
)

const subnetMaskFilterOptions = computed(() =>
  subnets.value.map((subnet) => ({
    label: subnet.subnetMask.toString(),
    value: subnet.subnetMask.toString(),
  }))
)

function createColumns({
  deleteSubnet,
  goTo,
  editModalHandler,
}: DataTableColumnMethods): DataTableColumns<Subnet> {
  return [
    {
      title: 'ID',
      key: 'id',
      resizable: true,
    },
    {
      title: 'Name',
      key: 'name',
      sorter: (row1, row2) => row1.name.localeCompare(row2.name),
      defaultFilterOptionValues: [],
      // FIXME: change the filter options to by the values of our data table
      filterOptions: subnetNameFilterOptions.value,
      filter(value, row) {
        return !!~row.name.indexOf(String(value))
      },
      resizable: true,
    },
    {
      title: 'Subnet IP',
      key: 'subnetIp',
      sorter: (row1, row2) => row1.subnetIp.localeCompare(row2.subnetIp),
      filterOptions: subnetIpFilterOptions.value,
      filter(value, row) {
        return !!~row.subnetIp.indexOf(String(value))
      },
      resizable: true,
    },
    {
      title: 'Subnet Mask',
      key: 'subnetMask',
      sorter: (row1, row2) => row1.subnetMask - row2.subnetMask,
      filterOptions: subnetMaskFilterOptions.value,
      filter(value, row) {
        return !!~row.subnetMask.toString().indexOf(String(value))
      },
      resizable: true,
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
              onClick: () => goTo(row),
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
              onClick: () => editModalHandler(row),
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
              onClick: () => deleteSubnet(row),
            },
            { default: () => 'Delete' }
          ),
        ])
      },
      resizable: true,
    },
  ]
}

const columns = createColumns({
  goTo(row: Subnet) {
    router.push(`/subnets/${row.id}`)
  },
  deleteSubnet,
  editModalHandler,
})

async function deleteSubnet(subnet: Subnet) {
  try {
    const message = await subnetService.delete(subnet.id)
    toast.success(message)
    subnets.value = subnets.value.filter((item) => item.id !== subnet.id)
  } catch {
    toast.error('Could not delete the subnet.')
  }
}

async function editSubnet(subnet: Subnet) {
  try {
    const body: SubnetEditBody = { ...subnet }
    const data = await subnetService.edit(subnet.id, body)
    const subnetIdx = subnets.value.findIndex((subnet) => subnet.id === data.id)
    if (subnetIdx === -1) return
    subnets.value[subnetIdx] = data
    toast.success('Subnet edited successfully.')
    showEditModal.value = false
  } catch {
    toast.error('Could not edit the subnet.')
    showEditModal.value = false
  }
}

function editModalHandler(subnet: Subnet) {
  currentEditSubnet.value = subnet
  showEditModal.value = true
}

const createSubnet = async (subnet: Omit<Subnet, 'id'>) => {
  try {
    if (!userStore.user) {
      return
    }
    const body: SubnetCreateBody = {
      name: subnet.name,
      subnetIp: subnet.subnetIp,
      subnetMask: subnet.subnetMask,
      userId: userStore.user.id,
    }

    const data = await subnetService.create(body)
    subnets.value.push(data)
    showCreateModal.value = false
    toast.success('Subnet was created successfully.')
  } catch {
    showCreateModal.value = false
    toast.error('Could not create the subnet.')
  }
}

const getSubnets = async () => {
  try {
    const data = await subnetService.subnets()
    subnets.value = data
  } catch {
    // toast.error('Could not fetch subne`ts')
  }
}

onMounted(async () => {
  await userStore.getUser()
  await getSubnets()
})
</script>

<style scoped></style>
