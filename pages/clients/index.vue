<template>
  <dashboard-panel>
    <div class="bg-slate-50 min-h-screen flex flex-col py-10 px-8">
      <h1 class="text-5xl mb-3 font-bold text-slate-700">Clients</h1>
      <h3 class="text-lg mb-5 font-medium text-slate-500">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
        praesentium!
      </h3>
      <QRCodeModal v-model="qrCodeModal" :qrcode="qrCodeImage" />
      <client-add-button @click="showCreateModal = true" />
      <ClientAddModal v-model="showCreateModal" @add="createClient" />

      <ClientEditModal
        v-model="showEditModal"
        :client="currentEditClient"
        @edit="editClient"
      />
      <div class="w-full flex gap-4 flex-wrap py-5">
        <n-data-table
          :columns="columns"
          :data="clients"
          :pagination="paginationReactive"
          :row-key="rowKey"
        />
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
  NTag,
} from 'naive-ui'
import type { RowData } from 'naive-ui/es/data-table/src/interface'
import { Fragment } from 'vue/jsx-runtime'
import {
  clientService,
  type ClientCreateBody,
  type ClientEditBody,
} from '~/core/services/client.service'
import { useUserStore } from '~/core/stores/UserStore'
import type { Client } from '~/core/types/client'
import IsEnabledToggler from '~/components/IsEnabledToggler.vue'

const showCreateModal = ref(false)
const showEditModal = ref(false)
const userStore = useUserStore()
const toast = useMessage()
const rowKey = (row: RowData) => row.id

const clients = ref<Client[]>([])

const currentEditClient = ref<Client | null>(null)

const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30],
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  },
})

type DataTableColumnMethods = {
  deleteClient: (row: Client) => Promise<void>
  editModalHandler: (row: Client) => void
  getQRCode: (row: Client) => Promise<void>
  downloadConfig: (row: Client) => Promise<void>
}

const clientNameFilterOptions = computed(() =>
  clients.value.map((client) => ({
    label: client.name,
    value: client.name,
  }))
)

const clientIpFilterOptions = computed(() =>
  clients.value.map((client) => ({
    label: client.clientIp,
    value: client.clientIp,
  }))
)

const userLoginFilterOptions = computed(() =>
  clients.value.map((client) => ({
    label: client.user!.login,
    value: client.user!.login,
  }))
)

const subnetNameFilterOptions = computed(() =>
  clients.value.map((client) => ({
    label: client.subnet!.name,
    value: client.subnet!.name,
  }))
)

function createColumns({
  deleteClient,
  editModalHandler,
  getQRCode,
  downloadConfig,
}: DataTableColumnMethods): DataTableColumns<Client> {
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
      filterOptions: clientNameFilterOptions.value,
      filter(value, row) {
        return !!~row.name.indexOf(String(value))
      },
      resizable: true,
    },
    {
      title: 'Client IP',
      key: 'clientIp',
      sorter: (row1, row2) => row1.clientIp.localeCompare(row2.clientIp),
      filterOptions: clientIpFilterOptions.value,
      filter(value, row) {
        return !!~row.clientIp.indexOf(String(value))
      },
      resizable: true,
    },
    {
      title: 'Public Key',
      key: 'publicKey',
      resizable: true,
    },
    {
      title: 'Private Key Reference',
      key: 'privateKeyRef',
      resizable: true,
    },
    {
      title: 'Status',
      key: 'isEnabled',
      resizable: true,
      render(row) {
        return h(Fragment, {}, [
          h(IsEnabledToggler, {
            modelValue: row.isEnabled,
            clientId: row.id,
          }),
        ])
      },
    },
    {
      title: 'Subnet Name',
      key: 'subnet.name',
      resizable: true,
      filterOptions: subnetNameFilterOptions.value,
      filter(value, row) {
        return !!~row.subnet!.name.indexOf(String(value))
      },
      render(row) {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px',
            },
            type: 'info',
            bordered: false,
          },
          {
            default: () => row.subnet?.name,
          }
        )
      },
    },
    {
      title: 'User Login',
      key: 'user.login',
      resizable: true,
      filterOptions: userLoginFilterOptions.value,
      filter(value, row) {
        return !!~row.user!.login.indexOf(String(value))
      },
      render(row) {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px',
            },
            type: 'success',
            bordered: false,
          },
          {
            default: () => row.user?.login,
          }
        )
      },
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
              color: '#f0a020',
              style: { marginLeft: '8px', marginBottom: '8px' }, // чтобы кнопки не слипались
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
              onClick: () => deleteClient(row),
            },
            { default: () => 'Delete' }
          ),
          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              color: '#18a058',
              style: { marginLeft: '8px' },
              onClick: () => downloadConfig(row),
            },
            { default: () => 'Download Configuration' }
          ),
          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              color: '#18a058',
              style: { marginLeft: '8px' },
              onClick: () => getQRCode(row),
            },
            { default: () => 'Get QR Code' }
          ),
        ])
      },
      resizable: true,
    },
  ]
}

const columns = createColumns({
  deleteClient,
  editModalHandler,
  getQRCode,
  downloadConfig,
})

async function deleteClient(client: Client) {
  try {
    const message = await clientService.delete(client.id)
    toast.success(message)
    clients.value = clients.value.filter((item) => item.id !== client.id)
  } catch {
    toast.error('Could not delete the client.')
  }
}

async function editClient(client: Client) {
  try {
    const body: ClientEditBody = { ...client }
    const data = await clientService.edit(client.id, body)

    const clientIdx = clients.value.findIndex((client) => client.id === data.id)
    if (clientIdx === -1) return
    clients.value[clientIdx] = data
    toast.success('Client edited successfully.')
    showEditModal.value = false
  } catch {
    toast.error('Could not edit the client.')
    showEditModal.value = false
  }
}

function editModalHandler(client: Client) {
  currentEditClient.value = client
  showEditModal.value = true
}

const createClient = async (client: Omit<Client, 'id'>) => {
  try {
    const body: ClientCreateBody = {
      name: client.name,
      clientIp: client.clientIp,
      userId: client.userId,
      subnetId: client.subnetId,
    }

    const data = await clientService.create(body)
    clients.value.push(data)
    showCreateModal.value = false
    toast.success('Client was created successfully.')
  } catch {
    showCreateModal.value = false
    toast.error('Could not create the client.')
  }
}

const getClients = async () => {
  try {
    const data = await clientService.clients()
    clients.value = data
  } catch {
    toast.error('Could not fetch clients')
  }
}

const qrCodeImage = ref<string>('')
const qrCodeModal = ref(false)

async function downloadConfig(client: Client) {
  try {
    const clientId = client.id
    const message = await clientService.configuration(clientId)
    toast.success(message)
  } catch {
    toast.error('Could not download configuration.')
  }
}

async function getQRCode(client: Client) {
  try {
    const clientId = client.id
    const qrcode = await clientService.qrcode(clientId)
    qrCodeImage.value = `data:image/png;base64,${qrcode}`
    qrCodeModal.value = true
    toast.success('Scan this QR Code to get the configuration.')
  } catch {
    toast.error('Could not download configuration QR Code.')
  }
}

onMounted(async () => {
  await userStore.getUser()
  await getClients()
})
</script>

<style scoped></style>
