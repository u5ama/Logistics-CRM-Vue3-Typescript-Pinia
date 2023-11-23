<script setup lang="ts">
import { useForm } from "vee-validate";
import Button from "primevue/button";
import { useChecklistsStore } from "@stores/checklists/checklists";
import { addChecklistFormSchema } from "@utils/schemas";
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useRoute } from "vue-router";
import { useLoading } from "@hooks";
import type { IChecklist, IChecklistItems } from "@/types/checklist";
import ChecklistFormExt from "@dashboard-views/checklists/checklistFormExt.vue";

const checklistsStore = useChecklistsStore();
const { checklist } = storeToRefs(checklistsStore);
const { addChecklist, getChecklist, updateChecklist } = checklistsStore;
const supplierId = parseInt(useRoute().params.id as string);
const isEditing = !!supplierId;
const [isSupplierLoading, setSupplierLoading] = useLoading(isEditing);

let checklistData: IChecklistItems[] = [
  {
    id: 0,
    created_at: "",
    updated_at: "",
    selectedOption: "",
    checkbox_question: "",
    checkbox_question_key_name: "Checklist Question",
    checkListOptions: [
      {
        name: "",
        option_question_key_name: "Option",
      },
    ],
  },
];

onMounted(async () => {
  if (isEditing) {
    await getChecklist(supplierId);
    updateFormValues();
  }
});

const updateFormValues = () => {
  if (checklist.value) {
    checklistData = checklist?.value.checklists;
    const { ...fields } = checklist.value;
    setValues({ ...fields });
    setSupplierLoading.stop();
  }
};

const addHandler = async (checklist: IChecklist) => {
  await addChecklist(checklist);
  useToast().success("Checklist added successfully");
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: addChecklistFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const checklistInfo = checklistData;
    const checklist = values as IChecklist;
    checklist.checklists = checklistInfo;
    if (isEditing) await updateHandler(checklist);
    else {
      await addHandler(checklist);
      resetFormHandler();
    }
  },
  ({ errors }) => console.log(errors)
);

const updateHandler = async (checklist: IChecklist) => {
  await updateChecklist(supplierId, checklist);
  useToast().success("Checklist updated successfully");
  setSupplierLoading.start();
  await getChecklist(supplierId);
  updateFormValues();
};
const resetFormHandler = () => {
  resetForm();
};
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "Edit" : "Add" }} Checklist
    </WidgetTypography>
    <div
      class="mt-8 flex flex-col gap-y-4"
      :class="{ 'loading-faded': isSupplierLoading }"
    >
      <UserProfileFormTextField label="Name" name="name" />
      <WidgetTypography variant="title" class="mb-2">
        {{ isEditing ? "Edit" : "Create" }} Checklist Items
      </WidgetTypography>
      <checklistFormExt :checklistData="checklistData" />
    </div>
    <div class="flex lg:justify-end">
      <Button
        :label="isEditing ? 'Update Checklist' : 'Save Checklist'"
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
