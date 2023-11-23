<script setup lang="ts">
import { useForm } from "vee-validate";
import Dialog from "primevue/dialog";
import { addSupplierContactFormSchema } from "@utils/schemas";
import Button from "primevue/button";
import { useSupplierContactsStore } from "@stores/suppliers/contacts";
import { useToast } from "vue-toastification";
import { computed, inject, onMounted, onUnmounted, watch } from "vue";
import { editSupplierInjectionKey } from "@utils/injectionKeys";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import { storeToRefs } from "pinia";
import type { ISupplierContact } from "@/types/supplier";

interface Props {
  selectedItem: ISupplierContact;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "success"]);
const isUpdating = computed(() => !!props.selectedItem.id);

const { supplierId } = inject(editSupplierInjectionKey)!;
const contactsStore = useSupplierContactsStore();
const { addContact, getContact, updateContact } = contactsStore;
const { contact } = storeToRefs(contactsStore);

onMounted(() => {
  getContact(supplierId);
});

onUnmounted(() => {
  contact.value = undefined;
});

const { handleSubmit, isSubmitting, setValues, setErrors } = useForm({
  validationSchema: addSupplierContactFormSchema,
  validateOnMount: false,
});

const addHandler = async (contact: ISupplierContact) => {
  contact.supplierId = supplierId;
  await addContact(contact);
  useToast().success("Contact added successfully");
};

const updateHandler = async (contact: ISupplierContact) => {
  contact.supplierId = supplierId;
  await updateContact(props.selectedItem.id, contact);
  useToast().success("Contact updated successfully");
};

const onSubmit = handleSubmit(async (values) => {
  const contact = values as ISupplierContact;
  if (isUpdating.value) await updateHandler(contact);
  else await addHandler(contact);
  emit("success");
  emit("close");
});

const resetFields = () => {
  setValues({});
  setErrors({});
};

watch(() => props.selectedItem, resetFields);
</script>

<template>
  <Dialog
    :visible="isOpen"
    :style="{ width: '450px' }"
    :header="(selectedItem?.name ? 'Edit' : 'Add') + ' Contact'"
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
