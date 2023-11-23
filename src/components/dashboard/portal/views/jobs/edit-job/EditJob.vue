<script setup lang="ts">
import { useRoute } from "vue-router";
import router, { DashboardRouteNames } from "@router";
import { computed, provide } from "vue";
import { editJobInjectionKey } from "@utils/injectionKeys";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import JobDocuments from "@dashboard-views/jobs/edit-job/tabs/job-documents/JobDocuments.vue";
import { useJobsStore } from "@stores/jobs/jobs";
import { storeToRefs } from "pinia";
import EditJobForm from "@dashboard-views/jobs/edit-job/tabs/edit-job/EditJobForm.vue";
import Timesheets from "@dashboard-views/jobs/edit-job/tabs/job-timesheets/Timesheets.vue";
import Allocations from "@dashboard-views/jobs/edit-job/tabs/job-allocations/Allocations.vue";

const jobsStore = useJobsStore();
const { job } = storeToRefs(jobsStore);
const jobId = parseInt(useRoute().params.id as string);

const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));

provide(editJobInjectionKey, { job, jobId });

const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.editJob,
    params: { id: jobId },
    query: { tab: e.index },
  });
};
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allJobs }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Jobs
  </RouterLink>
  <section class="mt-8">
    <div class="wrapper">
      <TabView
        class="my-4"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Job"><EditJobForm /></TabPanel>
        <TabPanel header="Field Staff"><Allocations /></TabPanel>
        <TabPanel header="Timesheets"><Timesheets /></TabPanel>
        <TabPanel header="Documents"><JobDocuments /></TabPanel>
      </TabView>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.wrapper :deep(*) {
  &.p-tabview {
    @apply rounded overflow-hidden;

    &-nav {
      @apply bg-transparent justify-center;

      &-link {
        @apply grid place-content-center;
      }
    }
    &-header {
      min-width: 144px;
    }
    &-panels {
      @apply bg-transparent;
    }
  }
}
</style>
