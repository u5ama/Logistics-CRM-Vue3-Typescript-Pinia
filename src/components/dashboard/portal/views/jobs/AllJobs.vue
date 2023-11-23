<script setup lang="ts">
import JobsTable from "@dashboard/widgets/jobs/JobsTable.vue";
import { onMounted, ref } from "vue";
import { FilterMatchMode } from "primevue/api";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import { DashboardRouteNames } from "@router";
import { useJobsStore } from "@stores/jobs/jobs";
import { storeToRefs } from "pinia";
import { useLoading, useModal } from "@hooks";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import JobConfirmDeleteDialog from "@dashboard-views/jobs/components/JobConfirmDeleteDialog.vue";
const jobsStore = useJobsStore();
const { jobs } = storeToRefs(jobsStore);
const { getAllJobs } = jobsStore;

onMounted(() => {
  fetchData();
});
const fetchData = async () => {
  setLoading.start();
  await getAllJobs();
  setLoading.stop();
};

const [isLoading, setLoading] = useLoading();
const [isDeleteModalOpen, deleteDialog] = useModal();
const selectedItem = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>

<template>
  <section class="widgets">
    <PortalWidget class="widget">
      <div class="flex justify-between items-center mb-7">
        <div class="">
          <WidgetTypography variant="title" class="mb-1">
            All Jobs
          </WidgetTypography>
        </div>
        <div class="flex gap-x-2">
          <RouterLink :to="{ name: DashboardRouteNames.newJob }">
            <Button
              icon="pi pi-plus"
              class="p-button-rounded p-button-success"
              v-tooltip.left="'Add New Job'"
            />
          </RouterLink>
          <Button
            icon="pi pi-replay"
            class="p-button-rounded p-button-secondary -rotate-45"
            @click="fetchData"
            v-tooltip.top="'Reload Data'"
            :loading="isLoading"
          />
        </div>
      </div>

      <SimpleLoader class="mt-20" v-if="isLoading" />
      <div class="" v-else>
        <div class="flex mb-3 justify-end">
          <span class="p-input-icon-left searchSize">
            <i class="pi pi-search" />
            <InputText
              class="searchSize"
              v-model="filters['global'].value"
              placeholder="Search Jobs"
            />
          </span>
        </div>
        <JobsTable :filters="filters" :jobs="jobs" />
      </div>
    </PortalWidget>
    <JobConfirmDeleteDialog
      :isOpen="isDeleteModalOpen"
      :selectedItem="selectedItem"
      @close="deleteDialog.close"
    />
  </section>
</template>

<style lang="scss" scoped>
.widgets {
  @apply grid gap-8;
  .invoices {
    min-height: 400px;
  }
}
</style>
<style scoped>
@media only screen and (max-width: 600px) {
  .searchSize {
    width: 100% !important;
  }
}
</style>
