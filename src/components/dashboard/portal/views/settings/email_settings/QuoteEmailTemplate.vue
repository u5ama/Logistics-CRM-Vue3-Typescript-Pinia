<script setup lang="ts">
import Button from "primevue/button";
import PortalWidget from "@dashboard/widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import { storeToRefs } from "pinia";
import { useLoading } from "@hooks";
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useForm } from "vee-validate";
import type { IQuoteEmailTemplateSettings } from "@/types/quoteEmailTemplateSettings";
import { quoteEmailSettingsFormSchema } from "@utils/schemas";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import QuoteEditor from "@dashboard/widgets/quotes/quoteEditor.vue";
import { useQuoteEmailSettingsStore } from "@stores/email_settings/quoteEmailSettings";

const quoteEmailSettingsStore = useQuoteEmailSettingsStore();
const { quoteEmailSetting } = storeToRefs(quoteEmailSettingsStore);
const { getAllEmailSettings, addEmailSetting } = quoteEmailSettingsStore;
const [isEmailSettingLoading, setEmailSettingLoading] = useLoading();

onMounted(async () => {
  setEmailSettingLoading.start();
  await getAllEmailSettings();
  setEmailSettingLoading.stop();
  updateFormValues();
});

const updateFormValues = () => {
  if (quoteEmailSetting.value) {
    const { ...fields } = quoteEmailSetting.value;
    setValues({ ...fields });
    setEmailSettingLoading.stop();
  }
};

const addHandler = async (
  quoteEmailSettingParam: IQuoteEmailTemplateSettings
) => {
  await addEmailSetting(quoteEmailSettingParam);
  updateFormValues();
  useToast().success("Quote Email Settings Updated!");
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: quoteEmailSettingsFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const emailSetting = values as IQuoteEmailTemplateSettings;
    await addHandler(emailSetting);
    updateFormValues();
  },
  ({ errors }) => console.log(errors)
);
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      Quote Email Settings
    </WidgetTypography>
    <div
      class="mt-8 flex flex-col gap-y-3 mb-5"
      :class="{ 'loading-faded': isEmailSettingLoading }"
    >
      <UserProfileFormTextField label="Company Name" name="company_name" />
      <UserProfileFormTextField label="Manager Name" name="op_manager_name" />
      <UserProfileFormTextField label="Manager Email" name="op_manager_email" />
      <UserProfileFormTextField label="Manager Phone" name="op_manager_phone" />
      <!--      <div>-->
      <!--        <label for="termsext-xs text-slate-500 ml-3 mb-2">-->
      <!--          Terms Conditions-->
      <!--        </label>-->
      <!--        <br />-->
      <!--        <QuoteEditor name="terms_conditions" />-->
      <!--      </div>-->
      <div>
        <label for="termsext-xs text-slate-500 ml-3 mb-2"> Note </label>
        <br />
        <QuoteEditor name="quote_note" />
      </div>
    </div>
    <div class="flex justify-end">
      <Button
        :label="'Update Email Settings'"
        icon="pi pi-save"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        :disabled="isEmailSettingLoading"
        @click="submitHandler"
      />
    </div>
  </PortalWidget>
</template>
