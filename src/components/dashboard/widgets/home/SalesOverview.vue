<script setup lang="ts">
import { LineChart } from "vue-chart-3";
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import { FontWeight } from "@app-types/styles";
import { currencyFormat } from "@utils/helpers";

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

const stats = [
  { name: "Average Project Sale", value: 20_000 },
  { name: "Average Project Cost", value: 6_000 },
  { name: "Annual Tax 2021 - 2022", value: 290_004 },
  { name: "Annual Income", value: 2_500_000 },
];

const chartData: ChartData<"line"> = {
  labels: ["a", "b", "c", "d", "e"],
  datasets: [
    {
      label: "Sales",
      data: [30, 15, 40, 25, 70],
      borderColor: "#DD9933",
      backgroundColor: "#DD99332C",
      fill: "start",
    },
  ],
};

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      display: false,
      beginAtZero: true,
    },
    x: {
      display: false,
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 0,
    },
  },
};
</script>

<template>
  <PortalWidget>
    <div class="flex flex-col h-full">
      <div class="mb-16">
        <WidgetTypography variant="title" class="mb-1">
          Sales Overview
        </WidgetTypography>
        <WidgetTypography variant="subtitle" class="">
          Recent Project Statistics
        </WidgetTypography>
      </div>

      <div class="grid grid-cols-2 gap-12">
        <div class="stat" v-for="stat in stats" :key="stat.name">
          <WidgetTypography variant="subtitle" class="mb-2">
            {{ stat.name }}
          </WidgetTypography>
          <WidgetTypography
            variant="subtitle"
            :weight="FontWeight.bold"
            class=""
          >
            {{ currencyFormat(stat.value) }}
          </WidgetTypography>
        </div>
      </div>

      <div class="absolute inset-0 top-auto h-32">
        <LineChart
          :style="{ height: '100%' }"
          :chartData="chartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </PortalWidget>
</template>
