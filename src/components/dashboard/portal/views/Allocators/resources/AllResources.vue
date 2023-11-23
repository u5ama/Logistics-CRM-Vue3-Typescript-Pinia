<script setup lang="ts">
import PortalWidget from "@components/dashboard/widgets/PortalWidget.vue";
import { DashboardRouteNames } from "@router";
import { useRouter } from "vue-router";

useRouter().replace({ name: DashboardRouteNames.resourceAllAttachments });
</script>

<template>
  <PortalWidget> </PortalWidget>
</template>
