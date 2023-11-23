<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef } from "vue";
import { useDriversStore } from "@stores/drivers/drivers";
import router, { DashboardRouteNames } from "@router";
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@dashboard/ui/DataTable.vue";
import { storeToRefs } from "pinia";
import { useLoading } from "@hooks";
import Button from "primevue/button";

const driversStore = useDriversStore();
const { drivers } = storeToRefs(driversStore);
const { getAllDrivers } = driversStore;

onMounted(() => {
  getAllDrivers();
});

const headers: Header[] = [
  { text: "ID", value: "id" },
  { text: "Name", value: "name", sortable: true },
  { text: "Email", value: "email", sortable: true },
  { text: "Phone", value: "phone", sortable: true },
  { text: "Created At", value: "date_added" },
  { text: "View Details", value: "actions" },
];

const parsedItems = computed(() =>
  [...drivers.value]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((supplier) => ({
      date_added: new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(supplier.created_at)),
      ...supplier,
    }))
);

const items: ComputedRef<Item[]> = parsedItems;
const actions = [{ icon: "pi pi-eye", tooltip: "View Driver", emit: "edit" }];

const [isLoading, setLoading] = useLoading();

const reloadHandler = async () => {
  setLoading.start();
  await getAllDrivers();
  setLoading.stop();
};

const editClientHandler = (driverId: number) => {
  router.push({
    name: DashboardRouteNames.editDriver,
    params: { id: driverId },
    query: { tab: 0 },
  });
};

const searchQuery = ref("");
</script>

<template>
  <PortalWidget>
    <div class="flex justify-between mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          Driver Information
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
        <label class="font-medium" for="searchQuery">Search Driver</label>
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
      @edit="editClientHandler"
      :hideFooter="false"
      :searchValue="searchQuery"
      buttonsPagination
    />
  </PortalWidget>
</template>

<style lang="scss" scoped></style>
