<script setup lang="ts">
import SubcontractorTable from "@dashboard/widgets/subcontractor/SubcontractorTable.vue";
</script>

<template>
  <section class="widgets">
    <SubcontractorTable class="users" />
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
