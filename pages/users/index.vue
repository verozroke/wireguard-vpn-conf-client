<template>
  <dashboard-panel>
    <div class="bg-slate-50 min-h-screen flex flex-col py-10 px-8">
      <h1 class="text-5xl mb-3 font-bold text-slate-700">Users</h1>
      <h3 class="text-lg mb-5 font-medium text-slate-500">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
        praesentium!
      </h3>
      <user-add-button @click="showCreateModal = true" />
      <UserAddModal v-model="showCreateModal" @add="createUser" />
      <UserEditModal
        v-model="showEditModal"
        :user="currentEditUser"
        @edit="editUser"
      />
      <UserChangePasswordModal
        v-model="showChangePasswordModal"
        :user="currentChangePasswordUser"
        @change-password="changePassword"
      />
      <div class="w-full flex gap-4 flex-wrap py-5">
        <n-data-table
          size="large"
          :columns="columns"
          :data="users"
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
  authService,
  type ChangePasswordBody,
} from '~/core/services/auth.service'
import {
  userService,
  type UserCreateBody,
  type UserEditBody,
} from '~/core/services/user.service'
import { useUserStore } from '~/core/stores/UserStore'
import type { User } from '~/core/types/user'

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showChangePasswordModal = ref(false)
const userStore = useUserStore()
const toast = useMessage()
const rowKey = (row: RowData) => row.id

const users = ref<User[]>([])

const currentEditUser = ref<User | null>(null)
const currentChangePasswordUser = ref<User | null>(null)

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
  deleteUser: (row: User) => Promise<void>
  editModalHandler: (row: User) => void
  changePasswordModalHandler: (row: User) => void
}

const loginFilterOptions = computed(() =>
  users.value.map((user) => ({
    label: user.login,
    value: user.login,
  }))
)

const roleFilterOptions = [
  {
    label: 'Admin',
    value: 'Admin',
  },
  {
    label: 'Employee',
    value: 'Employee',
  },
]

function createColumns({
  deleteUser,
  editModalHandler,
  changePasswordModalHandler,
}: DataTableColumnMethods): DataTableColumns<User> {
  return [
    {
      title: 'ID',
      key: 'id',
      resizable: true,
    },
    {
      title: 'Login',
      key: 'login',
      sorter: (row1, row2) => row1.login.localeCompare(row2.login),
      defaultFilterOptionValues: [],
      // FIXME: change the filter options to by the values of our data table
      filterOptions: loginFilterOptions.value,
      filter(value, row) {
        return !!~row.login.indexOf(String(value))
      },
      resizable: true,
    },
    {
      title: 'Role',
      key: 'role',
      sorter: (row1, row2) => row1.role.localeCompare(row2.role),
      filterOptions: roleFilterOptions,
      filter(value, row) {
        return !!~row.role.indexOf(String(value))
      },
      resizable: true,
      render(row) {
        if (row.role == 'Admin') {
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
              default: () => row.role,
            }
          )
        }
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
            default: () => row.role,
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
              onClick: () => deleteUser(row),
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
              onClick: () => changePasswordModalHandler(row),
            },
            { default: () => 'Change Password' }
          ),
        ])
      },
      resizable: true,
    },
  ]
}

const columns = createColumns({
  deleteUser,
  editModalHandler,
  changePasswordModalHandler,
})

function changePasswordModalHandler(user: User) {
  currentChangePasswordUser.value = user
  showChangePasswordModal.value = true
}

async function changePassword(
  user: User & { oldPassword: string; newPassword: string }
) {
  try {
    const body: ChangePasswordBody = {
      userId: user.id,
      newPassword: user.newPassword,
      oldPassword: user.oldPassword,
    }
    await authService.changePassword(body)
    toast.success('Password changed successfully.')
    showChangePasswordModal.value = false
  } catch {
    toast.error('Could not change the password.')
    showChangePasswordModal.value = false
  }
}

async function deleteUser(user: User) {
  try {
    const message = await userService.delete(user.id)
    toast.success(message)
    users.value = users.value.filter((item) => item.id !== user.id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (
      error.response.data.detail ==
      'Error deleting user: Foreign key constraint failed on the field: `Client_userId_fkey (index)`'
    ) {
      toast.error(
        'User has the clients attached to him. Delete the clients of the user first'
      )
      return
    }
    toast.error('Could not delete the user.')
  }
}

async function editUser(user: User) {
  try {
    const body: UserEditBody = { login: user.login }
    const data = await userService.edit(user.id, body)
    const userIdx = users.value.findIndex((user) => user.id === data.id)
    if (userIdx === -1) return
    users.value[userIdx] = data
    toast.success('User edited successfully.')
    showEditModal.value = false
  } catch {
    toast.error('Could not edit the user.')
    showEditModal.value = false
  }
}

function editModalHandler(user: User) {
  currentEditUser.value = user
  showEditModal.value = true
}

const createUser = async (user: Omit<User, 'id'> & { password: string }) => {
  try {
    if (!userStore.user) {
      return
    }

    const body: UserCreateBody = {
      login: user.login,
      password: user.password,
      is_admin: user.role === 'Admin',
    }

    const data = await userService.create(body)
    users.value.push(data)
    showCreateModal.value = false
    toast.success('User was created successfully.')
  } catch {
    showCreateModal.value = false
    toast.error('Could not create the user.')
  }
}

const getUsers = async () => {
  try {
    const data = await userService.users()
    users.value = data
  } catch {
    toast.error('Could not fetch users')
  }
}

onMounted(async () => {
  await userStore.getUser()
  await getUsers()
})
</script>

<style scoped></style>
