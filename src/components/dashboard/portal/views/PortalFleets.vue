<script setup lang="ts">
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
</script>

<template>
  <!-- Heading for the statistics section -->
  <StyledHeading class="mb-8">Starbuck Statistics</StyledHeading>

  <!-- Section containing the widgets -->
  <section class="widgets">
    <!-- Individual portal widgets -->
    <PortalWidget class="status">Status</PortalWidget>
    <PortalWidget class="issues">Issues</PortalWidget>
    <PortalWidget class="replacement-window">Replacement Window</PortalWidget>
    <PortalWidget class="cost-km">Cost Per Kilometre</PortalWidget>
    <PortalWidget class="cost-fuel">Fuel Costs</PortalWidget>
  </section>
</template>

<style lang="scss" scoped>
.widgets {
  /* Widget grid styling */
  @apply grid gap-8;
  grid-template-columns: repeat(1, 1fr);

  /* Responsive layout for medium-sized screens */
  @include respond(md) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "status issues"
      "replacement-window cost-km"
      "replacement-window cost-fuel";

    /* Widget placement within the grid */
    .issues {
      grid-area: issues;
    }
    .replacement-window {
      grid-area: replacement-window;
    }
    .cost-km {
      grid-area: cost-km;
    }
    .cost-fuel {
      grid-area: cost-fuel;
    }
  }

  /* Responsive layout for extra-large screens */
  @include respond(xl) {
    grid-template-rows: repeat(3, minmax(212px, max-content));
    grid-template-areas:
      "status issues issues"
      "replacement-window replacement-window cost-km"
      "replacement-window replacement-window cost-fuel";
  }
}
</style>
