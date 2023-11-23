<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useDashboardStore } from "@stores/dashboard";

const dashboardStore = useDashboardStore();
const { isSidebarOpen, isNavDropdownOpen } = storeToRefs(dashboardStore);
const { openSidebar, closeSidebar, closeNavDropdown } = dashboardStore;

const isBackdropVisible = computed(
  () => isNavDropdownOpen.value || isSidebarOpen.value
);

const backdropClickHandler = () => {
  closeSidebar();
  closeNavDropdown();
};
</script>

<template>
  <div class="wrapper mob-class" style="background: white !important">
    <header>
      <span
        class="md:hidden m-auto ml-4 text-3xl text-brand cursor-pointer"
        @click="openSidebar"
        ><i class="pi pi-bars"></i
      ></span>
      <slot name="header">Header</slot>
    </header>

    <aside class="hide-scrollbar sidebar" :class="{ open: isSidebarOpen }">
      <slot name="sidebar">Sidebar</slot>
    </aside>

    <main>
      <slot>
        <h1>Dashboard</h1>
      </slot>
    </main>

    <div
      class="backdrop"
      :class="{ show: isBackdropVisible, light: isNavDropdownOpen }"
      @click="backdropClickHandler"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  @apply grid bg-grey-100;
  --sidebar-width: 96px;
  --header-height: 90px;

  grid-template-columns: 1fr;
  grid-template-rows: var(--header-height) 1fr;
  grid-template-areas:
    "header"
    "main";

  min-height: 100vh;

  @include respond(md) {
    grid-template-columns: var(--sidebar-width) 1fr;
    grid-template-areas:
      "sidebar header"
      "sidebar main";
  }

  @include respond(lg) {
    --sidebar-width: 144px;
  }
}

header {
  grid-area: header;
  @apply flex border-b-2 border-white;
}

aside {
  grid-area: sidebar;
  @apply flex bg-black text-white md:translate-x-0 fixed inset-0 right-auto -translate-x-full transition-transform z-50 h-[100vh] overflow-y-scroll;
  scroll-behavior: smooth;

  &.open {
    @apply translate-x-0;
  }
}

main {
  grid-area: main;
}

.backdrop {
  @apply fixed inset-0 bg-black opacity-0 invisible transition-opacity z-40;

  &.show {
    @apply visible opacity-40;
  }

  &.light {
    @apply opacity-20;
  }
}
</style>
<style>
@media only screen and (max-width: 600px) {
  .mob-class {
    display: block !important;
  }
}
</style>