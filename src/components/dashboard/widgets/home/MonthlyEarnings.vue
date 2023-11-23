<script setup lang="ts">
import { PieChart } from "vue-chart-3";
import { Chart, PieController, ArcElement } from "chart.js";
import type { ChartData } from "chart.js";

import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import { FontWeight } from "@app-types/styles";
import { currencyFormat } from "@utils/helpers";

Chart.register(PieController, ArcElement);

const earnings = [
  { name: "Excavation", color: "#DD9933", value: 39_867 },
  { name: "Plant Hire", color: "#DD993399", value: 4547 },
  { name: "Other", color: "#DD9933CC", value: 1954 },
];

const chartData: ChartData<"pie"> = {
  labels: earnings.map((e) => e.name),
  datasets: [
    {
      label: "Earnings",
      data: [300, 50, 100],
      backgroundColor: earnings.map((e) => e.color),
    },
  ],
};
</script>

<template>
  <PortalWidget>
    <div class="flex flex-col h-full">
      <div class="earnings">
        <WidgetTypography variant="display" class="mb-3">
          $50,368
        </WidgetTypography>
        <WidgetTypography variant="title" :weight="FontWeight.normal">
          Earnings in August
        </WidgetTypography>
      </div>

      <div class="chart flex items-center mt-auto">
        <div class="w-2/3 text-center">
          <div class="w-4/5">
            <PieChart :chart-data="chartData" />
          </div>
        </div>
        <div class="flex flex-col gap-y-6">
          <div v-for="e in earnings" :key="e.name" class="flex items-center">
            <div
              :style="{ backgroundColor: e.color }"
              class="rounded-full w-12 h-12"
            ></div>
            <div class="ml-3 flex flex-col gap-y-1">
              <WidgetTypography variant="subtitle">
                {{ e.name }}
              </WidgetTypography>
              <WidgetTypography variant="subtitle" :weight="FontWeight.bold">
                {{ currencyFormat(e.value) }}
              </WidgetTypography>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PortalWidget>
</template>
