<script setup lang="ts">
// Import necessary dependencies and types
import { storeToRefs } from "pinia";
import { useAuthStore } from "@stores/auth";
import { useDashboardStore } from "@stores/dashboard";
import type { SidebarMenuItemData } from "@app-types/utils";
import { computed } from "vue";

// Access the authentication store and user data
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// Define props for the component
interface Props {
  routeName: SidebarMenuItemData["routeName"];
  iconClass: SidebarMenuItemData["iconClass"];
  title: SidebarMenuItemData["title"];
  authLevels: SidebarMenuItemData["authLevels"];
}

const props = defineProps<Props>();

// Access the dashboard store and closeSidebar method
const dashboardStore = useDashboardStore();
const { closeSidebar } = dashboardStore;

// Compute a property to check if the user has the required authentication level
const hasAuth = computed(() => {
  if (!props.authLevels) return true;
  return props.authLevels.includes(user.value!.user_type);
});
</script>

<template>
  <RouterLink
      class="router-link"
      :class="{ 'no-link': routeName === '#' }"
      :to="routeName === '#' ? '#' : { name: routeName }"
      @click="closeSidebar"
      v-if="hasAuth"
  >
    <div class="flex flex-col items-center cursor-pointer">
      <span
          class="icon-wrapper bg-grey rounded-full w-12 h-12 flex items-center justify-center text-2xl mb-1"
      >
        <i class="pi" :class="iconClass"></i>
      </span>
      <span class="text-white text-[10px] sm:block">{{ title }}</span>
    </div>
  </RouterLink>
</template>

<style lang="scss" scoped>
.router-link {
  @apply transition-transform;

  .icon-wrapper {
    @apply transition-colors;
  }

  &.router-link-active:not(.no-link) {
    @apply font-bold transition-transform;

    .icon-wrapper {
      @apply bg-brand border-2 border-gray-100;
    }
  }

  &:hover {
    .icon-wrapper {
      @apply bg-brand;
    }
  }
}
</style>
