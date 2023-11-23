<script setup lang="ts">
import { onMounted, ref } from "vue";
import { FilterMatchMode } from "primevue/api";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import { useDriverJobsStore } from "@stores/driver-jobs/jobs";
import { storeToRefs } from "pinia";
import { useLoading, useModal } from "@hooks";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import JobConfirmDeleteDialog from "@dashboard-views/jobs/components/JobConfirmDeleteDialog.vue";
import DriverJobsTable from "@dashboard/widgets/jobs/DriverJobsTable.vue";

const driverJobsStore = useDriverJobsStore();
const { jobs } = storeToRefs(driverJobsStore);
const { getAllJobs } = driverJobsStore;

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
      <div class="sm:w-full" v-else>
        <div class="flex mb-3 lg:justify-end">
          <span class="p-input-icon-left searchSize">
            <i class="pi pi-search" />
            <InputText
              class="searchSize"
              v-model="filters['global'].value"
              placeholder="Search Jobs"
            />
          </span>
        </div>
        <DriverJobsTable :filters="filters" :jobs="jobs" />
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
