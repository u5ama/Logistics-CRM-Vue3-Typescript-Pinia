<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef } from "vue";
import { useChecklistsStore } from "@stores/checklists/checklists";
import router, { DashboardRouteNames } from "@router";
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@dashboard/ui/DataTable.vue";
import { storeToRefs } from "pinia";
import { useLoading } from "@hooks";
import Button from "primevue/button";

const checklistsStore = useChecklistsStore();
const { checklists } = storeToRefs(checklistsStore);
const { getAllChecklists } = checklistsStore;

onMounted(() => {
  getAllChecklists();
});

const headers: Header[] = [
  { text: "ID", value: "id" },
  { text: "Name", value: "name", sortable: true },
  { text: "Created At", value: "date_added" },
  { text: "Actions", value: "actions" },
];

const parsedItems = computed(() =>
  [...checklists.value]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((checklist) => ({
      date_added: new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(checklist.created_at)),
      ...checklist,
    }))
);

const items: ComputedRef<Item[]> = parsedItems;
const actions = [{ icon: "pi pi-eye", tooltip: "View Checklist", emit: "edit" }];

const [isLoading, setLoading] = useLoading();

const reloadHandler = async () => {
  setLoading.start();
  await getAllChecklists();
  setLoading.stop();
};

const editChecklistHandler = (checklistId: number) => {
  router.push({
    name: DashboardRouteNames.viewNewChecklist,
    params: { id: checklistId }
  });
};

const searchQuery = ref("");
</script>

<template>
  <PortalWidget>
    <div class="flex justify-between mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          Checklist Information
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <RouterLink :to="{ name: DashboardRouteNames.newChecklist }">
          <Button
            icon="pi pi-plus"
            class="p-button-rounded p-button-success"
            v-tooltip.left="'Add New Checklist'"
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
        <label class="font-medium" for="searchQuery">Search Checklist</label>
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
      @edit="editChecklistHandler"
      :hideFooter="false"
      :searchValue="searchQuery"
      buttonsPagination
    />
  </PortalWidget>
</template>

<style lang="scss" scoped></style>
