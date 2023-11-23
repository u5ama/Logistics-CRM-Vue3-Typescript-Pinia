<script setup lang="ts">
import { useForm } from "vee-validate";
import Dialog from "primevue/dialog";
import { addSupplierItemFormSchema } from "@utils/schemas";
import Button from "primevue/button";
import { useSupplierItemsStore } from "@stores/suppliers/items";
import { useToast } from "vue-toastification";
import { computed, inject, onMounted, onUnmounted, watch } from "vue";
import { editSupplierInjectionKey } from "@utils/injectionKeys";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import { storeToRefs } from "pinia";
import type { ISupplierItems } from "@/types/supplier";
import UserProfileFormDropdown from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormDropdown.vue";

interface Props {
  selectedItem: ISupplierItems;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "success"]);
const isUpdating = computed(() => !!props.selectedItem.id);

const { supplierId } = inject(editSupplierInjectionKey)!;
const itemsStore = useSupplierItemsStore();
const { addItem, getItem, updateItem } = itemsStore;
const { item } = storeToRefs(itemsStore);

onMounted(() => {
  getItem(supplierId);
});

onUnmounted(() => {
  item.value = undefined;
});

const { handleSubmit, isSubmitting, setValues, setErrors } = useForm({
  validationSchema: addSupplierItemFormSchema,
  validateOnMount: false,
});

const addHandler = async (contact: ISupplierItems) => {
  contact.supplierId = supplierId;
  await addItem(contact);
  useToast().success("Item added successfully");
};

const updateHandler = async (contact: ISupplierItems) => {
  contact.supplierId = supplierId;
  await updateItem(props.selectedItem.id, contact);
  useToast().success("Item updated successfully");
};

const onSubmit = handleSubmit(async (values) => {
  const item = values as ISupplierItems;
  if (isUpdating.value) await updateHandler(item);
  else await addHandler(item);
  emit("success");
  emit("close");
});

const resetFields = () => {
  setValues({});
  setErrors({});
};

const gstOptions = [
  { name: "Yes", value: "Yes" },
  { name: "No", value: "No" },
];

watch(() => props.selectedItem, resetFields);
</script>

<template>
  <Dialog
    :visible="isOpen"
    :style="{ width: '450px' }"
    :header="(selectedItem?.item_code ? 'Edit' : 'Add') + ' Item'"
    :modal="true"
    @show="!isUpdating && resetFields()"
    class="p-fluid"
    :closable="false"
  >
    <div class="mt-8 flex flex-col gap-y-4" v-if="isOpen">
      <UserProfileFormTextField
        label="Item Code"
        name="item_code"
        :value="selectedItem.item_code"
      />
      <UserProfileFormTextField
        label="Item Description"
        name="item_description"
        :value="selectedItem.item_description"
      />
      <UserProfileFormTextField
        label="Site"
        name="site"
        :value="selectedItem.site"
      />
      <UserProfileFormTextField
        label="Unit Price"
        name="unit_price"
        :value="selectedItem.unit_price"
      />
      <UserProfileFormDropdown
        class="col-span-3"
        label="GST"
        name="gst_incl"
        :options="gstOptions"
        :value="selectedItem.gst_incl"
      />
      <UserProfileFormTextField
        label="UOM"
        name="UOM"
        :value="selectedItem.UOM"
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
        :label="selectedItem.item_code ? 'Update' : 'Add'"
        icon="pi pi-check"
        class="p-button p-button-primary w-full"
        :loading="isSubmitting"
        @click="onSubmit"
      />
    </template>
  </Dialog>
</template>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
  display: grid;
  place-items: center;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(1.1);
}
</style>
