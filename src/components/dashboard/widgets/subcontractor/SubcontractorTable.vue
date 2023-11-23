<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref } from "vue";
import { useLoading, useModal } from "@hooks";
import router, { DashboardRouteNames } from "@router";
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@dashboard/ui/DataTable.vue";
import PortalWidget from "@dashboard/widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import { useSubcontractorsStore } from "@stores/subcontractors/subcontractors";
import { storeToRefs } from "pinia";
import { FilterMatchMode } from "primevue/api";
import SubcontractorFormModal from "@dashboard-views/subcontractors/components/SubcontractorFormModal.vue";
import Button from "primevue/button";

const subcontractorsStore = useSubcontractorsStore();
const { subcontractors } = storeToRefs(subcontractorsStore);
const { getAllSubcontractors } = subcontractorsStore;
const [isFormModalOpen, formModal] = useModal();

const selectedItem = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const openAddNewModal = () => {
  selectedItem.value = {};
  formModal.open();
};
onMounted(() => {
  getAllSubcontractors();
});

const headers: Header[] = [
  { text: "ID", value: "id" },
  { text: "Name", value: "name", sortable: true },
  { text: "Email", value: "email", sortable: true },
  { text: "Phone", value: "phone", sortable: true },
  { text: "ABN", value: "abn", sortable: true },
  { text: "Tags", value: "tags", sortable: true },
  { text: "Created At", value: "date_added" },
  { text: "Actions", value: "actions" },
];

const parsedItems = computed(() =>
  [...subcontractors.value]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((subcontractor) => ({
      date_added: new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(subcontractor.created_at)),
      ...subcontractor,
    }))
);

const items: ComputedRef<Item[]> = parsedItems;
const actions = [
  { icon: "pi pi-user-edit", tooltip: "Edit Subcontractor", emit: "edit" },
  { icon: "pi pi-trash", tooltip: "Delete Subcontractor" },
];

const [isLoading, setLoading] = useLoading();

const reloadHandler = async () => {
  setLoading.start();
  await getAllSubcontractors();
  setLoading.stop();
};

const editSubcontractorHandler = (subcontractorId: number) => {
  router.push({
    name: DashboardRouteNames.editSubcontractor,
    params: { id: subcontractorId },
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
          Subcontractors
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          v-tooltip.left="'Add New Subcontractor'"
          @click="openAddNewModal"
        />
        <Button
          icon="pi pi-replay"
          class="p-button-rounded p-button-secondary -rotate-45"
          @click="reloadHandler"
          v-tooltip.top="'Reload Data'"
          :loading="isLoading"
        />
      </div>
    </div>

    <SubcontractorFormModal
      :isOpen="isFormModalOpen"
      :selectedItem="selectedItem"
      @close="formModal.close"
    />

    <div class="flex mb-2 justify-end">
      <div class="flex gap-2 items-center">
        <label class="font-medium" for="searchQuery"
          >Search Subcontractor</label
        >
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
      @edit="editSubcontractorHandler"
      :hideFooter="false"
      :searchValue="searchQuery"
      buttonsPagination
    />
  </PortalWidget>
</template>
<style>
thead.vue3-easy-data-table__header {
  z-index: 0;
}
</style>
