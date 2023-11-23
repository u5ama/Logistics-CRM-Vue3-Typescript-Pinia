<script setup lang="ts">
import { useForm } from "vee-validate";
import Button from "primevue/button";
import { useJobsStore } from "@stores/jobs/jobs";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useRoute } from "vue-router";
import { useLoading } from "@hooks";
import type { IJob, IJobAssets } from "@/types/jobs";
import { addJobFormSchema } from "@utils/schemas";
import { useResourceAssetsStore } from "@stores/resources/assets";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import UserProfileFormTextArea from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileTextArea.vue";
import InvoiceFormDropdown from "@dashboard-views/invoicing/InvoiceFormDropdown.vue";
import { useClientsStore } from "@stores/clients/clients";
import DateInput from "@components/form/DateInput.vue";
import JobAssets from "@dashboard-views/jobs/JobAssets.vue";

const jobsStore = useJobsStore();
const { job } = storeToRefs(jobsStore);
const { addJob, getJob, updateJob } = jobsStore;

const resourceAssetsStore = useResourceAssetsStore();
const { assets } = storeToRefs(resourceAssetsStore);
const { getAllAssets } = resourceAssetsStore;

const clientsStore = useClientsStore();
const { clients } = storeToRefs(clientsStore);
const { getAllClients } = clientsStore;

const jobId = parseInt(useRoute().params.id as string);
const isEditing = !!jobId;

const [isJobLoading, setJobLoading] = useLoading(isEditing);

let jobAssets: IJobAssets[] = [
  {
    id: 0,
    created_at: "",
    updated_at: "",
    asset_id: 0,
    start_date: "",
    end_date: "",
  },
];

onMounted(async () => {
  await getAllAssets();
  if (isEditing) {
    await getJob(jobId);
    updateFormValues();
    await getAllClients();
  }
});

const address = ref("");
const setPlace = (e: any) => {
  address.value = e.formatted_address;
};

const updateFormValues = () => {
  if (job.value) {
    if (job.value?.assets.length > 0) {
      jobAssets = job.value?.assets;
    }
    const { ...fields } = job.value;
    setValues({ ...fields });
    address.value = job.value.job_address;
    setJobLoading.stop();
  }
};

const addHandler = async (job: IJob) => {
  await addJob(job);
  useToast().success("Job added successfully");
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: addJobFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const locationAddress = address.value;
    const job_assets = jobAssets;
    const job = values as IJob;
    job.asset_ids = job_assets;
    job.job_address = locationAddress;
    if (isEditing) await updateHandler(job);
    else {
      await addHandler(job);
      resetFormHandler();
    }
  },
  ({ errors }) => console.log(errors)
);

const updateHandler = async (job: IJob) => {
  await updateJob(jobId, job);
  useToast().success("Job updated successfully");
  setJobLoading.start();
  await getJob(jobId);
  updateFormValues();
};
const resetFormHandler = () => {
  resetForm();
};
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "Edit" : "Create" }} Job
    </WidgetTypography>
    <div
      class="mt-8 flex flex-col gap-y-3"
      :class="{ 'loading-faded': isJobLoading }"
    >
      <UserProfileFormTextField label="Title" name="job_title" />
      <UserProfileFormTextArea label="Description" name="job_description" />
      <div>
        <label for="job_address">Address: {{ job?.job_address }}</label>
        <GMapAutocomplete
          placeholder="Update Address here.."
          @place_changed="setPlace"
          name="job_address"
          class="p-inputtext p-component w-full"
          :options="{
            componentRestrictions: {
              country: [
                'au',
              ]
            }
          }"
        >
        </GMapAutocomplete>
      </div>
      <InvoiceFormDropdown
        class="col-span-6"
        label="Choose Client"
        name="client_id"
        :options="clients"
        :loading="isJobLoading"
      />
      <div class="grid grid-cols-2 gap-2 mb-4">
        <DateInput label="Start Date" name="start_date" />
        <DateInput label="End Date" name="end_date" />
      </div>

      <div class="grid gap-2 mb-4">
        <WidgetTypography variant="title" class="mb-2">
          Select Job Assets
        </WidgetTypography>
        <JobAssets
          :jobAssets="jobAssets"
          :assets="assets"
          :loading="isJobLoading"
        />
      </div>
    </div>
    <div class="flex justify-end">
      <Button
        :label="isEditing ? 'Update Job' : 'Save Job'"
        icon="pi pi-save"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        :disabled="isJobLoading"
        @click="submitHandler"
      />
    </div>
  </PortalWidget>
</template>

<style lang="scss" scoped></style>
