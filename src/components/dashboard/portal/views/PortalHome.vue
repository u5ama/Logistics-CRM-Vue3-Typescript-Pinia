<script setup lang="ts">
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import ActiveProjects from "@dashboard-widgets/home/ActiveProjects.vue";
import SalesOverview from "@dashboard-widgets/home/SalesOverview.vue";
import MonthlyEarnings from "@dashboard-widgets/home/MonthlyEarnings.vue";
import WeatherForecast from "@dashboard-widgets/home/WeatherForecast.vue";
import DriverStatistics from "@dashboard-widgets/home/DriverStatistics.vue";
</script>

<template>
  <StyledHeading class="mb-8">Starbuck Dashboard</StyledHeading>
  <section class="widgets">
    <ActiveProjects class="projects" />
    <SalesOverview class="sales" />
    <MonthlyEarnings class="earnings" />
    <WeatherForecast class="weather" />
    <DriverStatistics class="stats" />
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
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, minmax(456px, min-content));
    grid-template-areas:
      "projects sales earnings"
      "weather stats stats";
  }
}
</style>
