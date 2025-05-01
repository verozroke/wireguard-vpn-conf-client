<template>
  <n-split
    direction="horizontal"
    :max="0.25"
    :min="0.15"
    :default-size="0.15"
  >
    <template #1>
      <div class="py-10 px-5 bg-slate-50 min-h-screen">
        <div class="flex flex-col gap-5 my-5 px-7">
          <Icon
            class="w-10 h-10"
            name="mdi:code-tags"
          />
          <div class="text-2xl font-bold">Dashboard</div>
        </div>
        <n-menu
          :options="menuOptions"
          @update:value="menuUpdateHandler"
        />
      </div>
    </template>
    <template #2>
      <slot />
    </template>
  </n-split>
</template>

<script setup lang="ts">
import { Icon, NuxtLink } from '#components';
import { NSplit, NMenu, type MenuOption, useMessage } from 'naive-ui';
import { authService } from '~/core/services/auth.service';

const toast = useMessage()
function renderIcon(name: string) {
  return () => h(Icon, {
    name,
  })
}

const menuUpdateHandler = async (key: string) => {
  if (key !== 'logout') return
  const message = await authService.logout()
  toast.success(message)
  reloadNuxtApp()
}

// TODO: add icons to nav
const menuOptions: MenuOption[] = [
  {
    key: 'divider-1',
    type: 'divider',
    props: {
      style: {
        marginLeft: '32px'
      }
    }
  },
  {
    label: () =>
      h(
        NuxtLink,
        {
          href: '/subnets'
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
        marginLeft: '32px'
      }
    }
  },
  {
    label: () =>
      h(
        NuxtLink,
        {
          href: '/clients'
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
        marginLeft: '32px'
      }
    }
  },
  {
    label: () =>
      h(
        NuxtLink,
        {
          href: '/users'
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
</script>

<style scoped></style>