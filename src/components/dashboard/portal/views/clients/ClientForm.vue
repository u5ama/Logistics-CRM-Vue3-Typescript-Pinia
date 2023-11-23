<script setup lang="ts">
import { useForm } from "vee-validate";
import Button from "primevue/button";
import { useClientsStore } from "@stores/clients/clients";
import { clientFormSchema } from "@utils/schemas";
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useRoute } from "vue-router";
import { useLoading } from "@hooks";
import type { IClients } from "@/types/clients";
import UserProfileFormPassword from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormPassword.vue";
import UserProfileFormDropdown from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormDropdown.vue";
import GSTSwitchInput from "@dashboard-views/products/components/GSTSwitchInput.vue";

const clientsStore = useClientsStore();
const { client } = storeToRefs(clientsStore);
const { addClient, getClient, updateClient } = clientsStore;
const clientId = parseInt(useRoute().params.id as string);
const isEditing = !!clientId;
const [isSupplierLoading, setSupplierLoading] = useLoading(isEditing);
const [isOptionsLoading, setOptionsLoading] = useLoading();

const terms = [
  { name: "COD", value: "COD" },
  { name: "Credit", value: "Credit" },
];

onMounted(async () => {
  setOptionsLoading.start();
  if (isEditing) {
    await getClient(clientId);
    updateFormValues();
  }
  setOptionsLoading.stop();
});

const updateFormValues = () => {
  if (client.value) {
    const { ...fields } = client.value;
    setValues({ ...fields });
    setSupplierLoading.stop();
  }
};

const addHandler = async (client: IClients) => {
  await addClient(client);
  useToast().success("Customer added successfully");
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: clientFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const client = values as IClients;
    if (isEditing) await updateHandler(client);
    else {
      await addHandler(client);
      resetFormHandler();
    }
  },
  ({ errors }) => console.log(errors)
);

const updateHandler = async (supplier: IClients) => {
  await updateClient(clientId, supplier);
  useToast().success("Customer updated successfully");
  setSupplierLoading.start();
  await getClient(clientId);
  updateFormValues();
};
const resetFormHandler = () => {
  resetForm();
};
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "Edit" : "Add" }} Customer
    </WidgetTypography>
    <div
      class="mt-8 flex flex-col gap-y-4"
      :class="{ 'loading-faded': isSupplierLoading }"
    >
      <UserProfileFormTextField label="Name" name="name" />
      <UserProfileFormTextField label="Email" name="email" />
      <div v-show="!clientId">
        <UserProfileFormPassword label="Password" name="password" />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <UserProfileFormTextField label="Phone" name="phone" />
        <UserProfileFormTextField label="Address" name="address" />
        <UserProfileFormTextField label="ABN" name="abn" />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <UserProfileFormDropdown
          label="Choose Term"
          name="account_terms"
          :options="terms"
          :loading="isOptionsLoading"
        />
        <UserProfileFormTextField
          class="mt-7"
          label="Credit Limit only if Credit selected"
          name="credit_limit"
        />
        <GSTSwitchInput label="Credit Activity" name="credit_activity" />
      </div>
    </div>
    <div class="flex lg:justify-end sm:mt-5">
      <Button
        :label="isEditing ? 'Update Customer' : 'Save Customer'"
        icon="pi pi-save"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        :disabled="isSupplierLoading"
        @click="submitHandler"
      />
    </div>
  </PortalWidget>
</template>

<style lang="scss" scoped></style>
