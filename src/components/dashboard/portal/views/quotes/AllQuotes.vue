<script setup lang="ts">
import QuotesTable from "@dashboard-widgets/quotes/QuotesTable.vue";
</script>

<template>
  <section class="widgets">
    <QuotesTable class="quotes" />
  </section>
</template>

<style lang="scss" scoped>
.widgets {
  @apply grid gap-8;

  .quotes {
    min-height: 400px;
  }
}
</style>
