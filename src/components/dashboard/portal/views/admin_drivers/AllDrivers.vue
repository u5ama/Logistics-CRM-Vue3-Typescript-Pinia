<script setup lang="ts">
import DriverTable from "@dashboard-widgets/drivers/DriverTable.vue";
</script>

<template>
  <section class="widgets">
    <DriverTable class="users" />
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
