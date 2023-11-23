<script setup lang="ts">
import { useForm } from "vee-validate";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import type { ISubcontractor } from "@app-types/subcontractor";
import { useSubcontractorsStore } from "@stores/subcontractors/subcontractors";
import { subcontractorFormSchema } from "@utils/schemas";
import { computed, watch } from "vue";
import { useToast } from "vue-toastification";
import SubcontractorTags from "@components/form/SubcontractorTags.vue";

interface Props {
  selectedItem: ISubcontractor;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "success"]);
const isUpdating = computed(() => !!props.selectedItem.id);
const subcontractorsStore = useSubcontractorsStore();
const { addSubcontractor, updateSubcontractor } = subcontractorsStore;

const { handleSubmit, isSubmitting, setValues, setErrors } = useForm({
  validationSchema: subcontractorFormSchema,
  validateOnMount: false,
});

const addHandler = async (subcontractor: ISubcontractor) => {
  await addSubcontractor(subcontractor);
  useToast().success("Subcontractor added successfully");
};

const updateHandler = async (subcontractor: ISubcontractor) => {
  await updateSubcontractor(props.selectedItem.id, subcontractor);
  useToast().success("Subcontractor updated successfully");
};

const resetFields = () => {
  setValues({});
  setErrors({});
};

watch(() => props.selectedItem, resetFields);

const submitHandler = handleSubmit(async (values) => {
  const subcontractor = values as ISubcontractor;
  if (isUpdating.value) await updateHandler(subcontractor);
  else await addHandler(subcontractor);
  emit("success");
  emit("close");
});
</script>

<template>
  <Dialog
    :visible="isOpen"
    :style="{ width: '450px' }"
    :header="(selectedItem?.name ? 'Edit' : 'Add') + ' Subcontractor'"
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
        label="ABN"
        name="abn"
        :value="selectedItem.abn"
      />
      <SubcontractorTags name="tags" label="Tags" :value="selectedItem.tags" />
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
