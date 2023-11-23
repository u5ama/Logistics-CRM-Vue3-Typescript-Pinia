<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef } from "vue";
import { useSuppliersStore } from "@stores/suppliers/suppliers";
import router, { DashboardRouteNames } from "@router";
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@dashboard/ui/DataTable.vue";
import { storeToRefs } from "pinia";
import { useLoading } from "@hooks";
import Button from "primevue/button";

const supplierStore = useSuppliersStore();
const { suppliers } = storeToRefs(supplierStore);
const { getAllSuppliers } = supplierStore;

onMounted(() => {
  getAllSuppliers();
});

const headers: Header[] = [
  { text: "ID", value: "id" },
  { text: "Name", value: "name", sortable: true },
  { text: "Email", value: "email", sortable: true },
  { text: "Phone", value: "phone", sortable: true },
  { text: "ABN", value: "abn", sortable: true },
  { text: "Created At", value: "date_added" },
  { text: "Actions", value: "actions" },
];

const parsedItems = computed(() =>
  [...suppliers.value]
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
const actions = [
  { icon: "pi pi-user-edit", tooltip: "Edit Supplier", emit: "edit" },
  { icon: "pi pi-trash", tooltip: "Delete Supplier" },
];

const [isLoading, setLoading] = useLoading();

const reloadHandler = async () => {
  setLoading.start();
  await getAllSuppliers();
  setLoading.stop();
};

const editSupplierHandler = (supplierId: number) => {
  router.push({
    name: DashboardRouteNames.editSupplier,
    params: { id: supplierId },
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
          Supplier Information
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <RouterLink :to="{ name: DashboardRouteNames.newSupplier }">
          <Button
            icon="pi pi-plus"
            class="p-button-rounded p-button-success"
            v-tooltip.left="'Add New Supplier'"
          />
        </RouterLink>

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
        <label class="font-medium" for="searchQuery">Search Supplier</label>
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
      @edit="editSupplierHandler"
      :hideFooter="false"
      :searchValue="searchQuery"
      buttonsPagination
    />
  </PortalWidget>
</template>

<style lang="scss" scoped></style>
