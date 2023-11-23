<script setup lang="ts">
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import { DashboardRouteNames } from "@router";
import Button from "primevue/button";
</script>

<template>
  <div class="flex justify-between items-center">
    <StyledHeading class="mb-8">User Management </StyledHeading>
     <div class="">
      <RouterLink :to="{ name: DashboardRouteNames.registeredUsers }">
        <Button
          class="p-button-secondary p-button-sm"
          icon="pi pi-user-edit"
          label="View New Users"
          v-if="$route.name === DashboardRouteNames.allUsers"
        />
      </RouterLink>
    </div>
  </div>

  <section class="widgets">
    <RouterView />
  </section>
</template>
