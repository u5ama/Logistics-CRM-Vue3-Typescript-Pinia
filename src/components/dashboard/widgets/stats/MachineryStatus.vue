<script setup lang="ts">
import { FontWeight } from "@app-types/styles";
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";

const headers = ["Type", "Status", "Location", "Last Serviced"];

const machines = [
  {
    id: 1,
    type: "Caterpillar 329EI",
    status: "Working",
    location: "Sydney",
    lastServiced: "01-06-2022",
  },
  {
    id: 2,
    type: "Caterpillar 329EI",
    status: "Working",
    location: "Melbourne",
    lastServiced: "01/10/2021",
    needsService: true,
  },
  {
    id: 3,
    type: "Caterpillar 329EI",
    status: "Not-Working",
    location: "Mechanic",
    lastServiced: "Current",
    red: true,
  },
  {
    id: 4,
    type: "Caterpillar 329EI",
    status: "Working",
    location: "Sydney",
    lastServiced: "01-06-2022",
  },
];
</script>

<template>
  <PortalWidget>
    <div class="mb-8">
      <WidgetTypography variant="title" class="mb-4">
        Machinery Status
      </WidgetTypography>
      <WidgetTypography variant="subtitle">
        Mechanical status of owned vehicles
      </WidgetTypography>
    </div>

    <div class="">
      <table class="w-full text-left">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header">
              <WidgetTypography :weight="FontWeight.normal">
                {{ header }}
              </WidgetTypography>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="machine in machines"
            :key="machine.id"
            :class="{ danger: machine.red }"
          >
            <td>
              <WidgetTypography>
                {{ machine.type }}
              </WidgetTypography>
            </td>
            <td>
              <WidgetTypography :weight="FontWeight.bold">
                {{ machine.status }}
              </WidgetTypography>
            </td>
            <td>
              <WidgetTypography :weight="FontWeight.bold">
                {{ machine.location }}
              </WidgetTypography>
            </td>
            <td>
              <WidgetTypography
                :class="{ 'text-yellow-500': machine.needsService }"
                :weight="FontWeight.bold"
              >
                {{ machine.lastServiced }}
              </WidgetTypography>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </PortalWidget>
</template>

<style lang="scss" scoped>
.danger {
  td:not(:first-child) {
    @apply text-red-500;
  }
}

table {
  /* border-collapse: collapse; */

  tr {
    @apply border-b border-gray-300;
  }

  td,
  th {
    @apply py-8;
  }
}
</style>
