<template>
  <n-split direction="horizontal" :max="0.25" :min="0.15" :default-size="0.15">
    <template #1>
      <img
        v-show="isVisible"
        src="https://i.pinimg.com/originals/9e/13/8d/9e138d71b5f8f83bc9d191babaff0397.gif"
        class="absolute top-0 bottom-0 left-0 right-0 z-50 w-full h-full transition-all"
        alt=""
      />
      <div class="py-10 px-5 bg-slate-50 min-h-screen">
        <div class="flex flex-col gap-5 my-5 px-7">
          <Icon class="w-10 h-10" name="mdi:code-tags" @click="prikol" />
          <div class="text-2xl font-bold">Dashboard</div>
        </div>
        <n-menu :options="menuOptions" @update:value="menuUpdateHandler" />
      </div>
    </template>
    <template #2>
      <slot />
    </template>
  </n-split>
</template>

<script setup lang="ts">
import { Icon, NuxtLink } from '#components'
import { NSplit, NMenu, type MenuOption, useMessage } from 'naive-ui'
import { useUserStore } from '~/core/stores/UserStore'

const toast = useMessage()
const userStore = useUserStore()
function renderIcon(name: string) {
  return () =>
    h(Icon, {
      name,
    })
}

const menuUpdateHandler = async (key: string) => {
  if (key !== 'logout') return
  const message = await userStore.logout()
  toast.success(message ? message : 'Logout unsuccessfull')
  reloadNuxtApp()
}

const menuOptions: MenuOption[] = [
  {
    key: 'divider-1',
    type: 'divider',
    props: {
      style: {
        marginLeft: '32px',
      },
    },
  },
  {
    label: () =>
      h(
        NuxtLink,
        {
          href: '/subnets',
        },
        { default: () => 'Subnets' }
      ),
    key: 'subnet',
    icon: renderIcon('mdi:lan'),
  },
  {
    key: 'divider-1',
    type: 'divider',
    props: {
      style: {
        marginLeft: '32px',
      },
    },
  },
  {
    label: () =>
      h(
        NuxtLink,
        {
          href: '/clients',
        },
        { default: () => 'Clients' }
      ),
    key: 'client',
    icon: renderIcon('mdi:shield-account'),
  },
  {
    key: 'divider-1',
    type: 'divider',
    props: {
      style: {
        marginLeft: '32px',
      },
    },
  },
  {
    label: () =>
      h(
        NuxtLink,
        {
          href: '/users',
        },
        { default: () => 'Users' }
      ),
    key: 'user',
    icon: renderIcon('mdi:account'),
  },
  {
    label: 'Log Out',
    icon: renderIcon('mdi:logout'),
    key: 'logout',
  },
]

const count = ref(0)
const isVisible = ref(false)
const prikol = () => {
  if (count.value < 10) {
    count.value += 1
    return
  }
  isVisible.value = true
  setTimeout(() => {
    isVisible.value = false
    count.value = 0
  }, 3000)
}
</script>

<style scoped></style>
