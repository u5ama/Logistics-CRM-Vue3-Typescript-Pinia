<script setup lang="ts">
import { useForm } from "vee-validate";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import UserProfileFormDropdown from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormDropdown.vue";
import { addNewTagFormSchema } from "@utils/schemas";
import { useResourceTagsStore } from "@stores/resources/tags";
import { ResourceTagType } from "@app-types/resources";
import { useToast } from "vue-toastification";
import { watch } from "vue";

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "success"]);
const { handleSubmit, isSubmitting, setErrors } = useForm({
  validationSchema: addNewTagFormSchema,
  validateOnMount: false,
});
const tagsStore = useResourceTagsStore();
const { addNewTag } = tagsStore;

const submitHandler = handleSubmit(async (values) => {
  const { name, tag_type } = values as Record<string, string>;
  await addNewTag(name, tag_type as ResourceTagType);
  emit("success");
  emit("close");
  useToast().success("Tag added successfully");
});

const tagTypeOptions = [
  { name: "Attachments Tag", value: ResourceTagType.Attachment },
  { name: "Assets Tag", value: ResourceTagType.Asset },
  { name: "Competency Tag", value: ResourceTagType.Competency },
  { name: "Resource Tag", value: ResourceTagType.Resource },
];

watch(
  () => props.isOpen,
  () => setErrors({})
);
</script>

<template>
  <Dialog
    :visible="isOpen"
    :style="{ width: '450px' }"
    :header="'Add new Tag'"
    :modal="true"
    class="p-fluid"
    :closable="false"
  >
    <div class="mt-8 flex flex-col gap-y-4" v-if="isOpen">
      <UserProfileFormTextField label="Tag Name" name="name" />
      <UserProfileFormDropdown
        label="Tag Type"
        name="tag_type"
        :options="tagTypeOptions"
        :value="ResourceTagType.Attachment"
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
        :label="'Add Tag'"
        icon="pi pi-check"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        @click="submitHandler"
      />
    </template>
  </Dialog>
</template>

<style lang="scss" scoped></style>
