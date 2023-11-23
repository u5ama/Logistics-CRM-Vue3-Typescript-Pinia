<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "@stores/auth";
import DashboardLayout from "@layouts/DashboardLayout.vue";
import DummyLayout from "@layouts/DummyLayout.vue";
import DashboardHeader from "@dashboard/header/DashboardHeader.vue";
import DashboardSidebar from "@dashboard/sidebar/DashboardSidebar.vue";
import DashboardPortal from "@dashboard/portal/DashboardPortal.vue";

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>

<template>
  <DashboardLayout v-if="isAuthenticated">
    <template #header>
      <DashboardHeader />
    </template>

    <template #sidebar>
      <DashboardSidebar />
    </template>

    <template #default>
      <DashboardPortal />
    </template>
  </DashboardLayout>

  <DummyLayout v-else>
    <p class="text-xl">
      Please
      <RouterLink class="font-semibold underline" to="/login">Login</RouterLink>
      First
    </p>

    {{ $router.push("/login") }}
  </DummyLayout>
</template>
