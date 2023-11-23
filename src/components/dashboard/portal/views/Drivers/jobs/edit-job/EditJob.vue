<script setup lang="ts">
import { useRoute } from "vue-router";
import router, { DashboardRouteNames } from "@router";
import { computed, onMounted, provide, ref } from "vue";
import { editJobInjectionKey } from "@utils/injectionKeys";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { useDriverJobsStore } from "@stores/driver-jobs/jobs";
import { storeToRefs } from "pinia";
import TimeSheets from "@dashboard-views/Drivers/jobs/edit-job/tabs/job-timesheets/Timesheets.vue";
import JobDocuments from "@dashboard-views/Drivers/jobs/edit-job/tabs/job-documents/JobDocuments.vue";
import OverviewJob from "@dashboard-views/Drivers/jobs/edit-job/tabs/edit-job/OverviewJob.vue";
import { useLoading, useModal } from "@hooks";
import AddDocumentModal from "@dashboard-views/Drivers/jobs/edit-job/tabs/job-documents/AddDocumentModal.vue";
import AddDriverTimesheetModal from "@dashboard-views/Drivers/jobs/edit-job/tabs/job-timesheets/AddDriverTimesheetModal.vue";
import AddCompleteChecklist from "@dashboard-views/Drivers/jobs/edit-job/tabs/job-checklists/AddCompleteChecklist.vue";

const driverJobsStore = useDriverJobsStore();
const { job } = storeToRefs(driverJobsStore);
const jobId = parseInt(useRoute().params.id as string);
const quick_action = ref("choose");
const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));
const isEditing = !!jobId;
const [isJobLoading, setJobLoading] = useLoading(isEditing);
const [isModalOpen, setModal] = useModal();
const [isTimeSheetModalOpen, setTimeSheetModal] = useModal();
const [isChecklistModalOpen, setChecklistModal] = useModal();
onMounted(async () => {
  setJobLoading.stop();
});
provide(editJobInjectionKey, { job, jobId });

const quick_actions = [
  { name: "Complete Checklist", value: "Complete Checklist" },
  { name: "Timesheet", value: "Timesheet" },
  { name: "Upload Documents", value: "Upload Documents" },
];

const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.editDriverJob,
    params: { id: jobId },
    query: { tab: e.index },
  });
};

const onDropChange = () => {
  if (quick_action.value == "Upload Documents") {
    setModal.open();
  }
  if (quick_action.value == "Timesheet") {
    setTimeSheetModal.open();
  }
  if (quick_action.value == "Complete Checklist") {
    setChecklistModal.open();
  }
};
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allDriverJobs }"
  >
    <i class="pi pi-arrow-left lg:text-xs sm:text-lg mr-1"></i> Back to All Jobs
  </RouterLink>
  <section class="mt-8">
    <AddDocumentModal
      v-if="isModalOpen"
      :open="isModalOpen"
      @close="setModal.close"
    />
    <AddDriverTimesheetModal
      v-if="isTimeSheetModalOpen"
      :open="isTimeSheetModalOpen"
      @close="setTimeSheetModal.close"
    />
    <AddCompleteChecklist
      v-if="isChecklistModalOpen"
      :open="isChecklistModalOpen"
      @close="setChecklistModal.close"
    />
    <div class="wrapper">
      <div class="flex flex-col">
        <div class="col-span-8 mb-8">
          <label class="font-bold" for="quick_action">Quick Actions</label
          ><br />
          <select
            class="bg-white py-3 px-4 rounded border w-full mt-3"
            name="quick_action"
            id="quick_action"
            v-model="quick_action"
            @change="onDropChange"
          >
            <option value="choose" disabled selected>Choose Action</option>
            <option
              v-for="option in quick_actions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.name }}
            </option>
          </select>
        </div>
      </div>
      <TabView
        :scrollable="true"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Overview"><OverviewJob /></TabPanel>
        <TabPanel header="TimeSheets"><TimeSheets /></TabPanel>
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
