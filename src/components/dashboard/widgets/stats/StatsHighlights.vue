<script setup lang="ts">
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import { FontWeight } from "@app-types/styles";

const stats = [
  { text: "Avg. Client Rating", value: "7.8/10" },
  { text: "Instagram Followers", value: "730,000" },
  { text: "Google Ads CPC", value: "$2.09" },
  { text: "Performance Overview", value: "$8.55 p/p" },
];
</script>

<template>
  <PortalWidget>
    <div class="flex flex-col justify-between h-full">
      <div class="">
        <WidgetTypography variant="title" class="mb-4">
          Highlights
        </WidgetTypography>
        <WidgetTypography variant="subtitle">
          Latest social statistics
        </WidgetTypography>
      </div>

      <div class="divide-y">
        <div
          v-for="stat in stats"
          class="flex justify-between items-center py-8 last-of-type:pb-0"
          :key="stat.text"
        >
          <WidgetTypography>{{ stat.text }}</WidgetTypography>
          <WidgetTypography :weight="FontWeight.bold">
            {{ stat.value }}
          </WidgetTypography>
        </div>
      </div>
    </div>
  </PortalWidget>
</template>
