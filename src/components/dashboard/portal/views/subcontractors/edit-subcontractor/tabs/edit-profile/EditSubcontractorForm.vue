<script setup lang="ts">
import { useForm } from "vee-validate";
import Button from "primevue/button";
import { useSubcontractorsStore } from "@stores/subcontractors/subcontractors";
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useRoute } from "vue-router";
import { useLoading } from "@hooks";
import type { ISubcontractor } from "@/types/subcontractor";
import { subcontractorFormSchema } from "@utils/schemas";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import SubcontractorTags from "@components/form/SubcontractorTags.vue";

const subcontractorsStore = useSubcontractorsStore();
const { subcontractor } = storeToRefs(subcontractorsStore);
const { getSubcontractor, updateSubcontractor } = subcontractorsStore;

const subcontractorId = parseInt(useRoute().params.id as string);
const isEditing = !!subcontractorId;
const [isJobLoading, setJobLoading] = useLoading(isEditing);

onMounted(async () => {
  if (isEditing) {
    await getSubcontractor(subcontractorId);
    updateFormValues();
  }
});

const updateFormValues = () => {
  if (subcontractor.value) {
    const { ...fields } = subcontractor.value;
    setValues({ ...fields });
    setJobLoading.stop();
  }
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: subcontractorFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const subcontractor = values as ISubcontractor;
    if (isEditing) await updateHandler(subcontractor);
    else {
      resetFormHandler();
    }
  },
  ({ errors }) => console.log(errors)
);

const updateHandler = async (subcontractor: ISubcontractor) => {
  await updateSubcontractor(subcontractorId, subcontractor);
  useToast().success("Job updated successfully");
  setJobLoading.start();
  await getSubcontractor(subcontractorId);
  updateFormValues();
};
const resetFormHandler = () => {
  resetForm();
};
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "Edit" : "Create" }} Subcontractor
    </WidgetTypography>
    <div
      class="mt-8 flex flex-col gap-y-3"
      :class="{ 'loading-faded': isJobLoading }"
    >
      <UserProfileFormTextField label="Full Name" name="name" />
      <UserProfileFormTextField label="Email" name="email" />
      <UserProfileFormTextField label="Phone Number" name="phone" />
      <UserProfileFormTextField label="ABN" name="abn" />
      <SubcontractorTags name="tags" label="Tags" />
    </div>
    <div class="flex lg:justify-end">
      <Button
        :label="isEditing ? 'Update Subcontractor' : 'Save Subcontractor'"
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
