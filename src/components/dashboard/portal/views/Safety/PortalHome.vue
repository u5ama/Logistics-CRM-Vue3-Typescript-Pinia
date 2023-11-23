<script setup lang="ts">
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import ChecklistSubmitted from "@dashboard/widgets/home/ChecklistSubmitted.vue";
import { useSafetyDashboardStore } from "@stores/dashboard/safetyDashboard";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import DriversChecklistTable from "@dashboard/widgets/home/DriversChecklistTable.vue";
import WeatherForecast from "@dashboard/widgets/home/WeatherForecast.vue";
import { useLoading } from "@hooks";
import SimpleLoader from "@components/UI/SimpleLoader.vue";

const safetyDashboardStore = useSafetyDashboardStore();
const { dashboardSafety } = storeToRefs(safetyDashboardStore);
const { getAllSafetyOfficerData } = safetyDashboardStore;
const [isLoading, setLoading] = useLoading();

onMounted(async () => {
  setLoading.start();
  await getAllSafetyOfficerData();
  setLoading.stop();
});
</script>

<template>
  <StyledHeading class="mb-8">Dashboard</StyledHeading>
  <SimpleLoader v-if="isLoading" />
  <section class="widgets" v-else-if="dashboardSafety">
    <ChecklistSubmitted
      class="projects"
      :value="dashboardSafety?.day"
      :hours="'24 Hours'"
    />
    <ChecklistSubmitted
      class="sales"
      :value="dashboardSafety?.twoDay"
      :hours="'48 Hours'"
    />
    <ChecklistSubmitted
      class="earnings"
      :value="dashboardSafety?.week"
      :hours="'7 Days'"
    />
    <WeatherForecast class="weather" />
    <DriversChecklistTable class="stats" />
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
    grid-template-columns: repeat(1, 1fr);
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
    grid-template-columns: repeat(3, 2fr);
    grid-template-rows: repeat(1, minmax(250px, min-content));
    grid-template-areas:
      "projects sales earnings"
      "weather stats stats";
  }
}
</style>
