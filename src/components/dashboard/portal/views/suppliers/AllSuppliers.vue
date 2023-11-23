<script setup lang="ts">
import SupplierTable from "@dashboard-widgets/suppliers/SupplierTable.vue";
</script>

<template>
  <section class="widgets">
    <SupplierTable class="users" />
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
