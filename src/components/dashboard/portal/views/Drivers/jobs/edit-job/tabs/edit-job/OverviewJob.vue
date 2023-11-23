<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useRoute } from "vue-router";
import { useDriverJobsStore } from "@stores/driver-jobs/jobs";
import { FontSize, FontWeight } from "@/types/styles";
import Chip from "primevue/chip";
import { useLoading } from "@hooks";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { DashboardRouteNames } from "@router";
import Button from "primevue/button";

const driverJobsStore = useDriverJobsStore();
const { job } = storeToRefs(driverJobsStore);
const { getJob } = driverJobsStore;

const jobId = parseInt(useRoute().params.id as string);
const isEditing = !!jobId;
const [isLoading, setLoading] = useLoading();

onMounted(async () => {
  await fetchData();
});
const fetchData = async () => {
  setLoading.start();
  await getJob(jobId);
  setLoading.stop();
};

const driverRows = computed(() =>
  job.value?.assets.map((doc) => ({
    id: doc.id,
    name: doc.name,
    start_date: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(doc.start_date)),
    end_date: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(doc.end_date)),
  }))
);
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "View" : "Create" }} Job Details
    </WidgetTypography>
    <div class="mt-8 flex flex-col gap-y-3">
      <div class="inline-flex flex-col">
        <WidgetTypography
          :size="FontSize.lg"
          :weight="FontWeight.bold"
          variant="subtitle2"
          style="color: black"
        >
          <span> Title </span>
        </WidgetTypography>
        <WidgetTypography
          :size="FontSize.lg"
          :weight="FontWeight.normal"
          variant="subtitle2"
          style="color: black"
        >
          <span>
            {{ job?.job_title }}
          </span>
        </WidgetTypography>
      </div>
      <div class="inline-flex flex-col">
        <WidgetTypography
          :size="FontSize.lg"
          :weight="FontWeight.bold"
          variant="subtitle2"
          style="color: black"
        >
          <span> Description </span>
        </WidgetTypography>
        <WidgetTypography
          :size="FontSize.lg"
          :weight="FontWeight.normal"
          variant="subtitle2"
          style="color: black"
        >
          <span>
            {{ job?.job_description }}
          </span>
        </WidgetTypography>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-12 gap-2">
        <div class="flex gap-y-3 gap-x-3">
          <WidgetTypography
            :size="FontSize.lg"
            :weight="FontWeight.bold"
            variant="subtitle2"
            style="color: black"
          >
            <span> Start Date: </span>
          </WidgetTypography>
          <WidgetTypography
            :size="FontSize.lg"
            :weight="FontWeight.normal"
            variant="subtitle2"
            style="color: black"
          >
            <span v-if="job">
              {{
                new Intl.DateTimeFormat("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(job?.start_date))
              }}
            </span>
          </WidgetTypography>
        </div>
        <div class="flex gap-y-2 gap-x-3">
          <WidgetTypography
            :size="FontSize.lg"
            :weight="FontWeight.bold"
            variant="subtitle2"
            style="color: black"
          >
            <span> End Date: </span>
          </WidgetTypography>
          <WidgetTypography
            :size="FontSize.lg"
            :weight="FontWeight.normal"
            variant="subtitle2"
            style="color: black"
          >
            <span v-if="job">
              {{
                new Intl.DateTimeFormat("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(job?.end_date))
              }}
            </span>
          </WidgetTypography>
        </div>
      </div>
      <div class="inline-flex flex-col">
        <WidgetTypography
          :size="FontSize.lg"
          :weight="FontWeight.bold"
          variant="subtitle2"
          style="color: black"
        >
          <span> Job Address </span>
        </WidgetTypography>
        <WidgetTypography
          :size="FontSize.lg"
          :weight="FontWeight.normal"
          variant="subtitle2"
          style="color: black"
        >
          <span>
            {{ job?.job_address }}
          </span>
        </WidgetTypography>
      </div>
      <div class="inline-flex flex-col">
        <WidgetTypography
          :size="FontSize.lg"
          :weight="FontWeight.bold"
          variant="subtitle2"
          style="color: black"
        >
          <span> Customer Name </span>
        </WidgetTypography>
        <WidgetTypography
          :size="FontSize.lg"
          :weight="FontWeight.normal"
          variant="subtitle2"
          style="color: black"
        >
          <span>
            {{ job?.client_name }}
          </span>
        </WidgetTypography>
      </div>
      <div class="inline-flex flex-col gap-y-2">
        <WidgetTypography
          :size="FontSize.lg"
          :weight="FontWeight.bold"
          variant="subtitle2"
          style="color: black"
        >
          <span> Assets # </span>
        </WidgetTypography>
        <div class="flex flex-col gap-y-6" v-if="job?.assets.length">
          <DataTable :value="driverRows" stripedRows responsiveLayout="scroll">
            <Column field="name" header="Asset">
              <template #body="{ data }">
                <Chip :label="data.name" />
              </template>
            </Column>
            <Column field="start_date" header="Start Date"></Column>
            <Column field="end_date" header="End Date"></Column>
            <Column field="end_date" header="View Checklists">
              <template #body="{ data }">
                <RouterLink
                  :to="{
                    name: DashboardRouteNames.showChecklists,
                    params: { id: data.id },
                  }"
                >
                  <Button
                    icon="pi pi-eye"
                    class="p-button-rounded p-button-secondary p-button-outlined mr-2"
                    v-tooltip.left="'View Checklists'"
                  />
                </RouterLink>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </PortalWidget>
</template>

<style scoped>
@media only screen and (max-width: 600px) {
  .widget {
    position: relative;
    overflow: hidden;
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
    padding: 3rem 1rem;
    box-shadow: 5px 5px 40px rgba(0, 0, 0, 0.039);
    border-radius: 40px;
  }
}
</style>
