<script setup lang="ts">
import { useForm } from "vee-validate";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import type { IClients } from "@app-types/clients";
import { useClientsStore } from "@stores/clients/clients";
import { clientFormSchema } from "@utils/schemas";
import { computed, watch } from "vue";
import { useToast } from "vue-toastification";
import UserProfileFormPassword from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormPassword.vue";

interface Props {
  selectedItem: IClients;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "success"]);
const isUpdating = computed(() => !!props.selectedItem.id);
const clientsStore = useClientsStore();
const { addClient, updateClient } = clientsStore;

const { handleSubmit, isSubmitting, setValues, setErrors } = useForm({
  validationSchema: clientFormSchema,
  validateOnMount: false,
});

const addHandler = async (client: IClients) => {
  await addClient(client);
  useToast().success("Customer added successfully");
};

const updateHandler = async (client: IClients) => {
  await updateClient(props.selectedItem.id, client);
  useToast().success("Customer updated successfully");
};

const resetFields = () => {
  setValues({});
  setErrors({});
};

watch(() => props.selectedItem, resetFields);

const submitHandler = handleSubmit(async (values) => {
  const client = values as IClients;
  if (isUpdating.value) await updateHandler(client);
  else await addHandler(client);
  emit("success");
  emit("close");
});
</script>

<template>
  <Dialog
    :visible="isOpen"
    :style="{ width: '450px' }"
    :header="(selectedItem?.name ? 'Edit' : 'Add') + ' Client'"
    :modal="true"
    @show="!isUpdating && resetFields()"
    class="p-fluid"
    :closable="false"
  >
    <div class="mt-8 flex flex-col gap-y-4" v-if="isOpen">
      <UserProfileFormTextField
        label="Full Name"
        name="name"
        :value="selectedItem.name"
      />
      <UserProfileFormTextField
        label="Email"
        name="email"
        :value="selectedItem.email"
      />
      <div v-show="!isUpdating">
        <UserProfileFormPassword
          label="Password"
          name="password"
          :value="selectedItem.password"
        />
      </div>
      <UserProfileFormTextField
        label="Phone Number"
        name="phone"
        :value="selectedItem.phone"
      />
      <UserProfileFormTextField
        label="Address"
        name="address"
        :value="selectedItem.address"
      />
      <UserProfileFormTextField
        label="ABN"
        name="abn"
        :value="selectedItem.abn"
      />
    </div>

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="p-button-text p-button-danger"
        :disabled="isSubmitting"
        @click="$emit('close')"
      />
      <Button
        :label="selectedItem.name ? 'Update' : 'Add'"
        icon="pi pi-check"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        @click="submitHandler"
      />
    </template>
  </Dialog>
</template>

<style lang="scss" scoped></style>
