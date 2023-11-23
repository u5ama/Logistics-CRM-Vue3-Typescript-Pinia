<script setup lang="ts">
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";

import { useDashboardStore } from "@stores/dashboard";
const dashboardStore = useDashboardStore();
const { weatherInfo } = storeToRefs(dashboardStore);
const { getDashboardInformation } = dashboardStore;
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

onMounted(async () => {
  await getDashboardInformation();
});

const cities = [
  { name: "Melbourne", weather: "Change of rain", temperature: 22 },
  { name: "Sydney", weather: "Storms", temperature: 26 },
  { name: "Brisbane", weather: "Sunny", temperature: 31 },
  { name: "Adelaide", weather: "Sunny", temperature: 21 },
];
</script>

<template>
  <PortalWidget>
    <div class="">
      <WidgetTypography variant="title" class="mb-7">
        Weather Forecast
      </WidgetTypography>

      <table class="w-full text-left border-separate border-spacing-y-7">
        <thead>
          <tr>
            <th>
              <WidgetTypography variant="subtitle2">
                Location
              </WidgetTypography>
            </th>
            <th class="text-right">
              <WidgetTypography variant="subtitle2">
                Temperature
              </WidgetTypography>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="weather in weatherInfo" :key="weather.day">
            <td>
              <WidgetTypography variant="title" class="mb-1">
                {{ weather.day }} {{ weather?.date }}
              </WidgetTypography>
              <WidgetTypography variant="subtitle">
                {{ weather?.condition }}
              </WidgetTypography>
            </td>
            <td class="text-right">
              <WidgetTypography variant="title">
                {{ weather?.max_temp }}&deg;
              </WidgetTypography>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </PortalWidget>
</template>
