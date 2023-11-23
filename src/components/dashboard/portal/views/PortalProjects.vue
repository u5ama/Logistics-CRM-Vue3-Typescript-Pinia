<script setup lang="ts">
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
</script>

<template>
  <StyledHeading class="mb-8">Starbuck Projects - Melbourne</StyledHeading>
  <section class="widgets">
    <PortalWidget class="info">Collins Place</PortalWidget>
    <PortalWidget class="earth">Earth Moved</PortalWidget>
    <PortalWidget class="completion-date">Completion Date</PortalWidget>
    <PortalWidget class="vehicles">Vehicles Assigned</PortalWidget>
    <PortalWidget class="directions">Directions from Depot</PortalWidget>
    <PortalWidget class="webcam">Live Webcam</PortalWidget>
  </section>
</template>

<style lang="scss" scoped>
.widgets {
  @apply grid gap-8;
  grid-template-columns: repeat(1, 1fr);

  @include respond(md) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "info info"
      "earth completion-date"
      "webcam webcam"
      "vehicles vehicles"
      "directions directions";

    .info {
      grid-area: info;
    }
    .earth {
      grid-area: earth;
    }
    .completion-date {
      grid-area: completion-date;
    }
    .vehicles {
      grid-area: vehicles;
    }
    .directions {
      grid-area: directions;
    }
    .webcam {
      grid-area: webcam;
    }

    @include respond(xl) {
      grid-template-areas:
        "info directions"
        "earth directions"
        "completion-date directions"
        "vehicles webcam";
    }
  }
}
</style>
