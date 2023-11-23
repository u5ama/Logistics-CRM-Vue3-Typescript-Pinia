<script setup lang="ts">
import SidebarIcon from "./SidebarIcon.vue";
import type { SidebarMenuItemData } from "@app-types/utils";
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@stores/auth";
import { storeToRefs } from "pinia";

// Define the Props interface to represent the component's props
interface Props {
  item: SidebarMenuItemData;
  isActive: boolean;
}

// Use the useAuthStore function to access the authentication store
const authStore = useAuthStore();
// Destructure the user property from the authStore and convert it to reactive references using storeToRefs
const { user } = storeToRefs(authStore);

// Capture the component props
const props = defineProps<Props>();
// Create a reference for the menuItemEl element using ref
const menuItemEl = ref<HTMLDivElement>();

// Call the onMounted lifecycle hook when the component is mounted
onMounted(() => {
  // Scroll the menuItemEl into view smoothly if the menu item is active
  if (props.isActive)
    menuItemEl.value?.scrollIntoView({ behavior: "smooth", block: "center" });
});

// Use computed to check if the user has authorization to access the menu item
const hasAuth = computed(() => {
  // If the menu item doesn't have authLevels, consider it accessible to all users
  if (!props.item.authLevels) return true;
  // Check if the user's user_type is included in the menu item's authLevels
  return props.item.authLevels.includes(user.value!.user_type);
});
</script>

<template>
  <div class="" ref="menuItemEl" v-if="hasAuth">
    <div class="transition-transform" :class="{ 'scale-125': isActive }">
      <SidebarIcon
        :routeName="item.routeName"
        :iconClass="item.iconClass"
        :title="item.title"
        :authLevels="item.authLevels"
      />
    </div>
    <div
      class="sub-items mt-5 flex flex-col gap-y-3"
      v-if="item.submenuItems && isActive"
    >
      <SidebarIcon
        v-for="subItem in item.submenuItems"
        :key="subItem.title"
        :routeName="subItem.routeName"
        :iconClass="subItem.iconClass"
        :title="subItem.title"
        :authLevels="subItem.authLevels"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sub-items :deep(.icon-wrapper) {
  @apply w-10 h-10;
}
</style>
