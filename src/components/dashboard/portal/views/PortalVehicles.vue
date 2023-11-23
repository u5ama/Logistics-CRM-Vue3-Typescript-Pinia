<script setup lang="ts">
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
</script>

<template>
  <StyledHeading class="mb-8">
    Starbuck - Driver Vehicle Assessment
  </StyledHeading>

  <section class="widgets">
    <PortalWidget class="vehicle">Vehicle Info</PortalWidget>
  </section>
</template>

<style lang="scss" scoped>
.widgets {
  @apply grid gap-8;

  .vehicle {
    min-height: 400px;
  }
}
</style>
