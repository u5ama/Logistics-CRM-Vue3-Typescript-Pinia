<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef } from "vue";
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@dashboard/ui/DataTable.vue";
import { storeToRefs } from "pinia";
import { useLoading } from "@hooks";
import Button from "primevue/button";
import { useJobTimeSheetStore } from "@stores/jobs/timesheets";
import { InvoiceStatus, type IJobTimeSheets } from "@/types/jobs";
import { mapTimeSheetActiveToString } from "@utils/helpers";

const timeSheetStore = useJobTimeSheetStore();
const { timesheets } = storeToRefs(timeSheetStore);
const { getAllDriversTimeSheets, changeTimeSheetStatus } = timeSheetStore;

onMounted(async () => {
  await getAllDriversTimeSheets();
});

const headers: Header[] = [
  { text: "Timesheet Date", value: "date_added" },
  { text: "User", value: "name", sortable: true },
  { text: "Start Time", value: "start_time", sortable: true },
  { text: "End Time", value: "end_time", sortable: true },
  { text: "Status", value: "status", sortable: true },
];

const parsedItems = computed(() =>
  [...timesheets.value]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((timesheet) => ({
      status: mapTimeSheetActiveToString(timesheet.invoice_status),
      date_added: new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(timesheet.created_at)),
      ...timesheet,
    }))
);

const items: ComputedRef<Item[]> = parsedItems;
const actions = [];
const [isLoading, setLoading] = useLoading();

const reloadHandler = async () => {
  setLoading.start();
  await getAllDriversTimeSheets();
  setLoading.stop();
};

const statusChangeHandler = async (timesheet: IJobTimeSheets) => {
  const newStatus =
    timesheet.invoice_status === InvoiceStatus.Invoiced
      ? InvoiceStatus.NotInvoiced
      : InvoiceStatus.Invoiced;

  await changeTimeSheetStatus(timesheet.id, newStatus);
  await reloadHandler();
};
const searchQuery = ref("");
</script>

<template>
  <PortalWidget>
    <div class="flex justify-between mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          Driver Timesheets
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <Button
          icon="pi pi-replay"
          class="p-button-rounded p-button-secondary -rotate-45"
          @click="reloadHandler"
          v-tooltip.top="'Reload Data'"
          :loading="isLoading"
        />
      </div>
    </div>

    <div class="flex mb-2 justify-end">
      <div class="flex gap-2 items-center">
        <label class="font-medium" for="searchQuery">Search Timesheet</label>
        <input
          class="rounded border border-gray-500 py-2 px-4"
          id="searchQuery"
          v-model="searchQuery"
        />
      </div>
    </div>

    <DataTable
      :loading="isLoading"
      :headers="headers"
      :items="items"
      :actions="actions"
      sort-by="date_added"
      @status-change="statusChangeHandler"
      :hideFooter="false"
      :searchValue="searchQuery"
      buttonsPagination
    />
  </PortalWidget>
</template>

<style lang="scss" scoped></style>
