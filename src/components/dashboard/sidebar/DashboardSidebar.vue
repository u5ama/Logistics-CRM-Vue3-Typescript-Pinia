<script setup lang="ts">
import { ref } from "vue";
import { starbuckLogoWhite } from "@images";
import SidebarMenuItem from "./SidebarMenuItem.vue";
import menuItems from "./menuItems";

// Reactive reference to track if the sidebar is in a submenu or not
const inSubMenu = ref<false | string>(false);
</script>

<template>
  <div
      v-if="menuItems.length > 0"
      class="flex flex-col gap-y-8 w-full md:py-16 py-8 px-3 text-center items-center"
      :class="{ 'in-sub-menu': inSubMenu }"
  >
    <img class="w-28" :src="starbuckLogoWhite" alt="starbuck-logo" />

    <!-- Render sidebar menu items -->
    <SidebarMenuItem
        v-for="item in menuItems"
        :key="item.title"
        :item="item"
        :isActive="item.isActive()"
    />
  </div>
</template>

<style lang="scss" scoped>
.in-sub-menu {
  /* Hide top-level sidebar links when in a submenu */
  :deep(.router-link:not(.open-submenu)) {
    display: none;
  }
  /* Display submenu links */
  :deep(.sub-items > .router-link) {
    display: block;
  }
}
</style>
