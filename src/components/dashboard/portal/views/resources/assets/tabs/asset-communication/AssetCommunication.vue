<script setup lang="ts">

import { inject, onMounted } from "vue";
import { editAssetInjectionKey } from "@utils/injectionKeys";
import { useForm } from "vee-validate";
import { addAssetSMSFormSchema } from "@utils/schemas";
import { useToast } from "vue-toastification";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import Panel from "primevue/panel";
import { useLoading, useMultiSelect } from "@hooks";
import type{ ISubcontractorSMS } from "@/types/resources";
import MultiSelectDropdown from "@components/form/MultiSelectDropdown.vue";
import UserProfileTextArea
  from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileTextArea.vue";
import Button from "primevue/button";
import { useSMSSubcontractorsStore } from "@stores/resources/sendSubcontractorSMS";
import { storeToRefs } from "pinia";

const { assetId } = inject(editAssetInjectionKey)!;
const isEditing = !!assetId;

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: addAssetSMSFormSchema,
  validateOnMount: false,
});

const [isOptionsLoading, setOptionsLoading] = useLoading();

const smsSubcontractorsStore = useSMSSubcontractorsStore();
const { subcontractors } = storeToRefs(smsSubcontractorsStore);
const { getAllSubcontractors, sendSMSSubcontractors } = smsSubcontractorsStore;

onMounted(async () => {
  setOptionsLoading.start();
  await getAllSubcontractors(assetId);
  setOptionsLoading.stop();
});

const addHandler = async (subcontractor: ISubcontractorSMS) => {
  await sendSMSSubcontractors(subcontractor);
  useToast().success("SMS Send successfully");
};

const submitHandler = handleSubmit(
  async (values) => {
    const subcontractor = values as ISubcontractorSMS;
      await addHandler(subcontractor);
      resetFormHandler();
  },
  ({ errors }) => console.log(errors)
);

const resetFormHandler = () => {
  resetForm();
  resetSubcontractors();
};

const [selectedSubcontractors, subcontractorsChangeHandler, resetSubcontractors] = useMultiSelect();
</script>

<template>
  <div class="wrapper max-w-6xl mt-6 mx-auto">
    <Panel>
      <template #header>
        <StyledHeading level="h3">Subcontractor SMS</StyledHeading>
      </template>

      <div
        class="mt-8 flex flex-col gap-y-4"
        :class="{ 'loading-faded': isOptionsLoading }"
      >
        <MultiSelectDropdown
          label="Choose Subcontractors"
          name="subcontractors"
          :items="subcontractors"
          :selectedItems="selectedSubcontractors"
          @change="subcontractorsChangeHandler"
          :loading="isOptionsLoading"
        />

        <UserProfileTextArea label="Message" name="message" />
        <div class="flex lg:justify-end">
          <Button
            :label="'Send SMS'"
            icon="pi pi-save"
            class="p-button p-button-primary"
            :loading="isSubmitting"
            :disabled="isOptionsLoading"
            @click="submitHandler"
          />
        </div>
      </div>
    </Panel>
  </div>
</template>