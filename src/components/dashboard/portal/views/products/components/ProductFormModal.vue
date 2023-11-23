<script setup lang="ts">
import { useForm } from "vee-validate";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import type { IProducts } from "@app-types/products";
import { useProductsStore } from "@stores/products";
import { productFormSchema } from "@utils/schemas";
import { computed, watch } from "vue";
import { useToast } from "vue-toastification";
import UserProfileFormDropdown from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormDropdown.vue";
import GSTSwitchInput from "./GSTSwitchInput.vue";
interface Props {
  selectedItem: IProducts;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "success"]);
const isUpdating = computed(() => !!props.selectedItem.id);
const productsStore = useProductsStore();
const { addProduct, updateProduct } = productsStore;

const { handleSubmit, isSubmitting, setValues, setErrors } = useForm({
  validationSchema: productFormSchema,
  validateOnMount: false,
});

const addHandler = async (product: IProducts) => {
  await addProduct(product);
  useToast().success("Product added successfully");
};

const updateHandler = async (product: IProducts) => {
  await updateProduct(props.selectedItem.id, product);
  useToast().success("Product updated successfully");
};

const resetFields = () => {
  setValues({});
  setErrors({});
};

watch(() => props.selectedItem, resetFields);

const submitHandler = handleSubmit(async (values) => {
  const product = values as IProducts;

  if (isUpdating.value) await updateHandler(product);
  else await addHandler(product);

  emit("success");
  emit("close");
});
const uomOptions = [
  { name: "TON", value: "TON" },
  { name: "DAY", value: "DAY" },
  { name: "EA", value: "EA" },
  { name: "HR", value: "HR" },
];
const defaultValues = {
  uom: uomOptions[0].value,
  gstCheck: false,
};
</script>

<template>
  <Dialog
    :visible="isOpen"
    :style="{ width: '450px' }"
    :header="(selectedItem?.name ? 'Edit' : 'Add') + ' Product'"
    :modal="true"
    @show="!isUpdating && resetFields()"
    class="p-fluid"
    :closable="false"
  >
    <div class="mt-8 flex flex-col gap-y-4" v-if="isOpen">
      <UserProfileFormTextField
        label="Name"
        name="name"
        :value="selectedItem.name"
      />
      <UserProfileFormTextField
        label="Description"
        name="description"
        :value="selectedItem.description"
      />
      <UserProfileFormTextField
        label="Docket"
        name="docket"
        :value="selectedItem.docket"
      />
      <UserProfileFormTextField
        label="Price"
        name="price"
        :value="selectedItem.price"
      />
      <UserProfileFormTextField
        label="EPA Docket"
        name="epa_number"
        :value="selectedItem.epa_number"
      />
      <GSTSwitchInput
        label="Add GST"
        name="gst_check"
        :value="selectedItem.gst_check"
      />
      <UserProfileFormTextField
        label="GST"
        name="gst"
        :value="selectedItem.gst"
      />
      <UserProfileFormDropdown
        class="col-span-1"
        label="UOM"
        name="uom"
        :options="uomOptions"
        :value="defaultValues.uom"
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
