<script setup lang="ts">
import PortalWidget from "@dashboard/widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import { useQuoteSettingsStore } from "@stores/quotes/quoteSettings";
import { storeToRefs } from "pinia";
import { useLoading } from "@hooks";
import { onMounted } from "vue";
import type { IQuoteSettings } from "@/types/quoteSettings";
import { useToast } from "vue-toastification";
import { useForm } from "vee-validate";
import { quoteSettingFormSchema } from "@utils/schemas";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import Button from "primevue/button";
import QuoteEditor from "@dashboard/widgets/quotes/quoteEditor.vue";

const QuoteSettingsStore = useQuoteSettingsStore();
const { quoteSetting } = storeToRefs(QuoteSettingsStore);
const { getAllQuoteSettings, addQuoteSetting } = QuoteSettingsStore;
const [isQuoteLoading, setQuoteLoading] = useLoading();

onMounted(async () => {
  setQuoteLoading.start();
  await getAllQuoteSettings();
  setQuoteLoading.stop();
  updateFormValues();
});
const updateFormValues = () => {
  if (quoteSetting.value) {
    const { ...fields } = quoteSetting.value;
    setValues({ ...fields });
    setQuoteLoading.stop();
  }
};
const addHandler = async (quoteSetting: IQuoteSettings) => {
  await addQuoteSetting(quoteSetting);
  useToast().success("Quote Setting Updated successfully");
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: quoteSettingFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const quoteSetting = values as IQuoteSettings;
    await addHandler(quoteSetting);
    resetFormHandler();
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
      Quote Settings
    </WidgetTypography>
    <div
      class="mt-8 flex flex-col gap-y-3 mb-5"
      :class="{ 'loading-faded': isQuoteLoading }"
    >
      <UserProfileFormTextField
        label="Operation Manager Name"
        name="op_manager_name"
      />
      <UserProfileFormTextField
        label="Operation Manager Email"
        name="op_manager_email"
      />
      <UserProfileFormTextField
        label="Operation Manager Phone"
        name="op_manager_phone"
      />
      <quoteEditor
        name="terms_conditions"
        label="Terms And Conditions"
        :value="quoteSetting?.terms_conditions"
      />
    </div>
    <div class="flex justify-end">
      <Button
        :label="'Update Quote Setting'"
        icon="pi pi-save"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        :disabled="isQuoteLoading"
        @click="submitHandler"
      />
    </div>
  </PortalWidget>
</template>
