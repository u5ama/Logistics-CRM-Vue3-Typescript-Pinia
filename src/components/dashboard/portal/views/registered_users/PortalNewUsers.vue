<script setup lang="ts">
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import { DashboardRouteNames } from "@router";
import Button from "primevue/button";
</script>

<template>
  <div class="flex justify-between items-center">
    <StyledHeading class="mb-8">New Registered User </StyledHeading>
  </div>
  <section class="widgets">
    <RouterView />
  </section>
</template>
