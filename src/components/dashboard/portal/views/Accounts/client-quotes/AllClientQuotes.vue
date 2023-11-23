<script setup lang="ts">
import ClientQuotesTable from "@dashboard-widgets/quotes/ClientQuotesTable.vue";
</script>

<template>
  <section class="widgets">
    <ClientQuotesTable class="quotes" />
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
