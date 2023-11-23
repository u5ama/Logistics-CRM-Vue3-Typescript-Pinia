<script setup lang="ts">
import InvoiceTable from "@dashboard-widgets/invoices/InvoiceTable.vue";
</script>

<template>
  <section class="widgets">
    <InvoiceTable class="invoices" />
  </section>
</template>

<style lang="scss" scoped>
.widgets {
  @apply grid gap-8;

  .invoices {
    min-height: 400px;
  }
}
</style>
