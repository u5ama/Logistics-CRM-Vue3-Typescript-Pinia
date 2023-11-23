<script setup lang="ts">
import TimesheetTable from "@dashboard-widgets/drivers/TimesheetTable.vue";
</script>

<template>
  <section class="widgets">
    <TimesheetTable class="users" />
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
