<script setup lang="ts">
import { useForm } from "vee-validate";
import Button from "primevue/button";
import { useDriverJobsStore } from "@stores/driver-jobs/jobs";
import { addJobFormSchema } from "@utils/schemas";
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import UserProfileFormTextArea from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileTextArea.vue";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useRoute } from "vue-router";
import { useLoading, useMultiSelect } from "@hooks";
import type { IJob } from "@/types/jobs";
import { useResourceAssetsStore } from "@stores/resources/assets";
import MultiSelectDropdown from "@components/form/MultiSelectDropdown.vue";
import InvoiceFormDropdown from "@dashboard-views/invoicing/InvoiceFormDropdown.vue";
import { useClientsStore } from "@stores/clients/clients";
import DateInput from "@components/form/DateInput.vue";

const driverJobsStore = useDriverJobsStore();
const { job } = storeToRefs(driverJobsStore);
const { addJob, getJob, updateJob } = driverJobsStore;

const resourceAssetsStore = useResourceAssetsStore();
const { assets } = storeToRefs(resourceAssetsStore);
const { getAllAssets } = resourceAssetsStore;

const jobId = parseInt(useRoute().params.id as string);
const isEditing = !!jobId;
const [isJobLoading, setJobLoading] = useLoading(isEditing);

const clientsStore = useClientsStore();
const { clients } = storeToRefs(clientsStore);
const { getAllClients } = clientsStore;

onMounted(async () => {
  await getJob(jobId);
  await getAllAssets();
  await getAllClients();
  updateFormValues();
});

const updateFormValues = () => {
  if (job.value) {
    const toIds = (items: any[]) => items.map((i) => i.id);
    const toIdsString = (items: any[]) => toIds(items).join(",");

    const { asset_ids, ...fields } = job.value;
    setValues({ ...fields, asset_ids: toIdsString(asset_ids) });
    selectedAssets.value = toIds(asset_ids);
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
    const job = values as IJob;

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

const [selectedAssets, assetsChangeHandler, resetAssets] = useMultiSelect();
const resetFormHandler = () => {
  resetForm();
  resetAssets();
};
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "Edit" : "Add" }} Job
    </WidgetTypography>

    <div
      class="mt-8 flex flex-col gap-y-4"
      :class="{ 'loading-faded': isJobLoading }"
    >
      <MultiSelectDropdown
        label="Select Asset"
        name="asset_ids"
        :items="assets"
        :selectedItems="selectedAssets"
        @change="assetsChangeHandler"
        :loading="isJobLoading"
      />
      <UserProfileFormTextField label="Title" name="job_title" />
      <UserProfileFormTextArea label="Description" name="job_description" />
      <UserProfileFormTextField label="Address" name="job_address" />
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
