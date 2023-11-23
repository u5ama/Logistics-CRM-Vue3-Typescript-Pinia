<script setup lang="ts">
import PortalWidget from "@dashboard/widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import Button from "primevue/button";
import { useToast } from "vue-toastification";
import { useForm } from "vee-validate";
import { passwordSettingsFormSchema } from "@utils/schemas";
import { usePasswordSettingsStore } from "@stores/password_setting/passwordSettings";
import { useLoading } from "@hooks";
import { onMounted } from "vue";
import type { IUserPassword } from "@/types/user";
import TextInput from "@components/form/TextInput.vue";

const passwordSettingsStore = usePasswordSettingsStore();
const { addPasswordSetting } = passwordSettingsStore;
const [isPasswordSettingLoading, setPasswordSettingLoading] = useLoading();

onMounted(async () => {
  setPasswordSettingLoading.start();
  setPasswordSettingLoading.stop();
});

const addHandler = async (passwordSettingParam: IUserPassword) => {
  await addPasswordSetting(passwordSettingParam);
  useToast().success("Password Settings Updated!");
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: passwordSettingsFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const passwordSetting = values as IUserPassword;
    await addHandler(passwordSetting);
  },
  ({ errors }) => console.log(errors)
);
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      Password Settings
    </WidgetTypography>
    <div
      class="mt-8 flex flex-col gap-y-3 mb-5"
      :class="{ 'loading-faded': isPasswordSettingLoading }"
    >
      <TextInput
        label="Old Password"
        name="old_password"
        type="password"
        placeholder="Old Password"
      />
      <TextInput
        label="New Password"
        name="new_password"
        type="password"
        placeholder="New Password"
      />
      <TextInput
        label="Confirm Password"
        name="confirm_password"
        type="password"
        placeholder="Confirm Password"
      />
    </div>
    <div class="flex lg:justify-end">
      <Button
        :label="'Update Password'"
        icon="pi pi-save"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        :disabled="isPasswordSettingLoading"
        @click="submitHandler"
      />
    </div>
  </PortalWidget>
</template>
