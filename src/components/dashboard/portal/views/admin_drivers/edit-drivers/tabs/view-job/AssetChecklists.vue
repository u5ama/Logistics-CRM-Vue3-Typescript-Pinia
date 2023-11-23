<script setup lang="ts">
import { computed, onMounted } from "vue";
import Panel from "primevue/panel";
import { storeToRefs } from "pinia";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useLoading } from "@hooks";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import router, { DashboardRouteNames } from "@router";
import Button from "primevue/button";
import { useResourceAssetsStore } from "@stores/resources/assets";
import { useRoute } from "vue-router";

const resourceAssetsStore = useResourceAssetsStore();
const { asset } = storeToRefs(resourceAssetsStore);
const { getAsset } = resourceAssetsStore;
const assetId = parseInt(useRoute().params.id as string);
const [isLoading, setLoading] = useLoading();

const fetchAllocations = async () => {
  setLoading.start();
  await getAsset(assetId);
  setLoading.stop();
};

onMounted(async () => {
  if (!asset.value) await fetchAllocations();
});

const driverRows = computed(() =>
  asset.value?.checklists.map((doc) => ({
    id: doc.id,
    checklist_name: doc.name,
    checklist_id: doc.id,
    date: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(doc.created_at)),
  }))
);

const editDriverHandler = (checklistId: number) => {
  router.push({
    name: DashboardRouteNames.viewChecklist,
    params: { id: checklistId },
  });
};
</script>

<template>
  <div class="wrapper max-w-6xl mt-6 mx-auto">
    <Panel>
      <template #header>
        <StyledHeading level="h3">Assets Checklists</StyledHeading>
      </template>
      <template #icons>
        <Button
          icon="pi pi-replay"
          class="p-button-rounded p-button-secondary -rotate-45"
          @click="fetchAllocations"
          v-tooltip.top="'Reload Data'"
        />
      </template>
      <SimpleLoader v-if="isLoading" />
      <div class="flex flex-col gap-y-6" v-else-if="asset?.checklists.length">
        <DataTable :value="driverRows" stripedRows responsiveLayout="scroll">
          <Column field="id" header="ID"></Column>
          <Column field="checklist_name" header="Checklist Name"></Column>
          <Column field="date" header="Created At"></Column>
          <Column header="Actions">
            <template #body="{ data }">
              <Button
                icon="pi pi-eye"
                class="p-button-primary p-button-rounded p-button-text"
                v-tooltip.right="'View Checklist'"
                @click="editDriverHandler(data.checklist_id)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
      <p class="text-center mt-4" v-else>No Records Found</p>
    </Panel>
  </div>
</template>

<style lang="scss" scoped>
.wrapper :deep(*) {
  .p-panel-content {
    height: 500px;
    overflow-y: scroll;
  }
  .p-tag {
    @apply bg-slate-200 px-4;
  }
  .tag {
    @apply bg-slate-200 rounded-full px-2 py-1 font-semibold;
  }
}
</style>
