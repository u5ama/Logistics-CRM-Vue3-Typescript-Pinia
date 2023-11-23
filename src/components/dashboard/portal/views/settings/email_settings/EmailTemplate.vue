<script setup lang="ts">
import Button from "primevue/button";
import PortalWidget from "@dashboard/widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import { storeToRefs } from "pinia";
import { useLoading } from "@hooks";
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useForm } from "vee-validate";
import type { IEmailTemplateSettings } from "@/types/emailTemplateSettings";
import { emailSettingsFormSchema } from "@utils/schemas";
import { useEmailSettingsStore } from "@stores/email_settings/emailSettings";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import QuoteEditor from "@dashboard/widgets/quotes/quoteEditor.vue";

const emailSettingsStore = useEmailSettingsStore();
const { emailSetting } = storeToRefs(emailSettingsStore);
const { getAllEmailSettings, addEmailSetting } = emailSettingsStore;
const [isEmailSettingLoading, setEmailSettingLoading] = useLoading();

onMounted(async () => {
  setEmailSettingLoading.start();
  await getAllEmailSettings();
  setEmailSettingLoading.stop();
  updateFormValues();
});

const updateFormValues = () => {
  if (emailSetting.value) {
    const { ...fields } = emailSetting.value;
    setValues({ ...fields });
    setEmailSettingLoading.stop();
  }
};

const addHandler = async (emailSetting: IEmailTemplateSettings) => {
  await addEmailSetting(emailSetting);
  updateFormValues();
  useToast().success("Invoice Email Settings Updated Successfully");
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: emailSettingsFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const emailSetting = values as IEmailTemplateSettings;
    await addHandler(emailSetting);
    updateFormValues();
  },
  ({ errors }) => console.log(errors)
);
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      Invoice Email Settings
    </WidgetTypography>
    <div
      class="mt-8 flex flex-col gap-y-3 mb-5"
      :class="{ 'loading-faded': isEmailSettingLoading }"
    >
      <UserProfileFormTextField label="Account Name" name="account_name" />
      <UserProfileFormTextField label="Account BSB" name="account_bsb" />
      <UserProfileFormTextField label="Account Number" name="account_number" />
      <UserProfileFormTextField
        label="Account Inquiry Email"
        name="inquiry_email"
      />
      <div>
        <label for="termsext-xs text-slate-500 ml-3 mb-2">
          Terms Conditions
        </label>
        <br />
        <QuoteEditor name="terms" />
      </div>
      <div>
        <label for="termsext-xs text-slate-500 ml-3 mb-2"> Note </label>
        <br />
        <QuoteEditor name="note" />
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
