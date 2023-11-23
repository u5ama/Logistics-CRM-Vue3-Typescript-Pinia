<script setup lang="ts">
import ChecklistTable from "@dashboard-widgets/checklists/ChecklistTable.vue";
</script>

<template>
  <section class="widgets">
    <ChecklistTable class="users" />
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
