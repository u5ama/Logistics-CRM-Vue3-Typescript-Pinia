<script setup lang="ts">
import { useForm } from "vee-validate";
import Button from "primevue/button";
import { useSuppliersStore } from "@stores/suppliers/suppliers";
import { addSupplierFormSchema } from "@utils/schemas";
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useRoute } from "vue-router";
import { useLoading } from "@hooks";
import type { ISupplier } from "@/types/supplier";

const supplierStore = useSuppliersStore();
const { supplier } = storeToRefs(supplierStore);
const { addSupplier, getSupplier, updateSupplier } = supplierStore;
const supplierId = parseInt(useRoute().params.id as string);
const isEditing = !!supplierId;
const [isSupplierLoading, setSupplierLoading] = useLoading(isEditing);

onMounted(async () => {
  if (isEditing) {
    await getSupplier(supplierId);
    updateFormValues();
  }
});

const updateFormValues = () => {
  if (supplier.value) {
    const { ...fields } = supplier.value;
    setValues({ ...fields });
    setSupplierLoading.stop();
  }
};

const addHandler = async (supplier: ISupplier) => {
  await addSupplier(supplier);
  useToast().success("Supplier added successfully");
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: addSupplierFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const supplier = values as ISupplier;
    if (isEditing) await updateHandler(supplier);
    else {
      await addHandler(supplier);
      resetFormHandler();
    }
  },
  ({ errors }) => console.log(errors)
);

const updateHandler = async (supplier: ISupplier) => {
  await updateSupplier(supplierId, supplier);
  useToast().success("Supplier updated successfully");
  setSupplierLoading.start();
  await getSupplier(supplierId);
  updateFormValues();
};
const resetFormHandler = () => {
  resetForm();
};
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "Edit" : "Add" }} Supplier
    </WidgetTypography>
    <div
      class="mt-8 flex flex-col gap-y-4"
      :class="{ 'loading-faded': isSupplierLoading }"
    >
      <UserProfileFormTextField label="Name" name="name" />
      <UserProfileFormTextField label="Email" name="email" />
      <div class="grid grid-cols-2 gap-2">
        <UserProfileFormTextField label="Phone" name="phone" />
        <UserProfileFormTextField label="ABN" name="abn" />
      </div>
    </div>
    <div class="flex lg:justify-end">
      <Button
        :label="isEditing ? 'Update Supplier' : 'Save Supplier'"
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
