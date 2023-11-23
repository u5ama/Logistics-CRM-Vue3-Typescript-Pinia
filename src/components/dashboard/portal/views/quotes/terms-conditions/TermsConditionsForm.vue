<script setup lang="ts">
import { useForm } from "vee-validate";
import Button from "primevue/button";
import { useTermsConditionsStore } from "@stores/quotes/termsConditions";
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useRoute } from "vue-router";
import { useLoading } from "@hooks";
import type { IQuoteTermsConditions } from "@/types/quotes";
import QuoteEditor from "@dashboard/widgets/quotes/quoteEditor.vue";
const termsConditionsStore = useTermsConditionsStore();
const { termsCondition } = storeToRefs(termsConditionsStore);
const { addTermCondition, updateTermCondition, getTermsCondition } =
  termsConditionsStore;

const termsConditionId = parseInt(useRoute().params.id as string);
const isEditing = !!termsConditionId;
const [isAttachmentLoading, setAttachmentLoading] = useLoading(isEditing);

onMounted(async () => {
  if (isEditing) {
    await getTermsCondition(termsConditionId);
    updateFormValues();
  }
});

const updateFormValues = () => {
  if (termsCondition.value) {
    const { ...fields } = termsCondition.value;
    setValues({ ...fields });
    setAttachmentLoading.stop();
  }
};

const addHandler = async (termsCondition: IQuoteTermsConditions) => {
  await addTermCondition(termsCondition);
  useToast().success("Terms & Conditions template added successfully");
};

const updateHandler = async (termsCondition: IQuoteTermsConditions) => {
  await updateTermCondition(termsConditionId, termsCondition);
  useToast().success("Terms & Conditions template updated successfully");
  setAttachmentLoading.start();
  await getTermsCondition(termsConditionId);
  updateFormValues();
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const termsCondition = values as IQuoteTermsConditions;

    if (isEditing) await updateHandler(termsCondition);
    else {
      await addHandler(termsCondition);
      resetFormHandler();
    }
  },
  ({ errors }) => console.log(errors)
);

const resetFormHandler = () => {
  resetForm();
};
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "Edit" : "Add" }} Terms & Conditions Template
    </WidgetTypography>

    <div
      class="mt-8 flex flex-col gap-y-4"
      :class="{ 'loading-faded': isAttachmentLoading }"
    >
      <UserProfileFormTextField label="Template Header" name="title" />
      <div>
        <label for="termsext-xs text-slate-500 ml-3 mb-3">
          Terms & Conditions Body
        </label>
        <br />
        <QuoteEditor name="terms_conditions" class="mt-2" />
      </div>
    </div>
    <div class="flex lg:justify-end mt-5">
      <Button
        :label="isEditing ? 'Update Template' : 'Save Template'"
        icon="pi pi-save"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        :disabled="isAttachmentLoading"
        @click="submitHandler"
      />
    </div>
  </PortalWidget>
</template>

<style lang="scss" scoped></style>
