<script setup lang="ts">
import { useForm } from "vee-validate";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import { addNewCategoryFormSchema } from "@utils/schemas";
import { useToast } from "vue-toastification";
import { watch } from "vue";
import { useResourceCategoriesStore } from "@stores/resources/categories";

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "success"]);
const { handleSubmit, isSubmitting, setErrors } = useForm({
  validationSchema: addNewCategoryFormSchema,
  validateOnMount: false,
});
const skillsStore = useResourceCategoriesStore();
const { addNewCategory } = skillsStore;

const submitHandler = handleSubmit(async (values) => {
  const { name } = values as Record<string, string>;
  await addNewCategory(name);
  emit("success");
  emit("close");
  useToast().success("Tag Category added successfully");
});

watch(
  () => props.isOpen,
  () => setErrors({})
);
</script>

<template>
  <Dialog
    :visible="isOpen"
    :style="{ width: '450px' }"
    :header="'Add New Category'"
    :modal="true"
    class="p-fluid"
    :closable="false"
  >
    <div class="mt-8 flex flex-col gap-y-4" v-if="isOpen">
      <UserProfileFormTextField label="Category Name" name="name" />
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
        :label="'Add Category'"
        icon="pi pi-check"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        @click="submitHandler"
      />
    </template>
  </Dialog>
</template>

<style lang="scss" scoped></style>
