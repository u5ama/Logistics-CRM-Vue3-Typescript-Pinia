<script setup lang="ts">
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@dashboard/ui/DataTable.vue";
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";

const headers: Header[] = [
  { text: "Name", value: "name", sortable: true },
  { text: "Vehicle", value: "vehicle", sortable: true },
  { text: "Jobs", value: "jobs", sortable: true },
  { text: "Actions", value: "actions" },
];

const items: Item[] = [
  { name: "John Smith", vehicle: "Excavator", jobs: 22 },
  { name: "John Smith", vehicle: "Excavator", jobs: 8 },
  { name: "John Smith", vehicle: "Excavator", jobs: 11 },
  { name: "John Smith", vehicle: "Excavator", jobs: 4 },
];

const actions = [
  { icon: "pi pi-chart-line" },
  { icon: "pi pi-arrows-h" },
  { icon: "pi pi-trash" },
];
</script>

<template>
  <PortalWidget>
    <div class="mb-7">
      <WidgetTypography variant="title" class="mb-1">
        Driver Statistics
      </WidgetTypography>
      <WidgetTypography variant="subtitle" class="">
        Recent Project Statistics
      </WidgetTypography>
    </div>

    <DataTable :headers="headers" :items="items" :actions="actions" />
  </PortalWidget>
</template>

<style lang="scss" scoped></style>
