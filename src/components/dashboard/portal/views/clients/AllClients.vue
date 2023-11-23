<script setup lang="ts">
import ClientTable from "@dashboard-widgets/clients/ClientTable.vue";
</script>

<template>
  <section class="widgets">
    <ClientTable class="users" />
  </section>
</template>

<style lang="scss" scoped>
.widgets {
  @apply grid gap-8;
  .users {
    min-height: 400px;
  }
}
</style>
