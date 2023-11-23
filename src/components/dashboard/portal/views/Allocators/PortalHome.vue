<script setup lang="ts">
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import WeatherForecast from "@dashboard-widgets/home/WeatherForecast.vue";
import OpenJobsAssets from "@dashboard/widgets/home/OpenJobsAssets.vue";
import AssetsInUse from "@dashboard/widgets/home/AssetsInUse.vue";
import { ref } from "vue";
import { FilterMatchMode } from "primevue/api";

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>

<template>
  <StyledHeading class="mb-8">Dashboard</StyledHeading>
  <section class="widgets">
    <OpenJobsAssets :filters="filters" />
    <AssetsInUse :filters="filters" />
    <WeatherForecast class="weather" />
  </section>
</template>

<style lang="scss" scoped>
.drivers-table {
  tr {
    @apply border-b border-gray-300 py-4;
  }
}
.widgets {
  @apply grid gap-8;
  grid-template-columns: repeat(1, 1fr);

  @include respond(md) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "projects weather"
      "sales earnings "
      "stats stats";

    .projects {
      grid-area: projects;
    }
    .sales {
      grid-area: sales;
    }
    .earnings {
      grid-area: earnings;
    }
    .weather {
      grid-area: weather;
    }
    .stats {
      grid-area: stats;
    }
  }

  @include respond(xl) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, minmax(456px, min-content));
    grid-template-areas:
      "projects sales earnings"
      "weather stats stats";
  }
}
</style>
