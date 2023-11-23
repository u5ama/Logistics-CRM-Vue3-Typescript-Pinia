<script setup lang="ts">
import { useForm } from "vee-validate";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { addNewTagFormSchema } from "@utils/schemas";
import UserProfileFormTextField from "../user-profile/profile-form/UserProfileFormTextField.vue";
import UserProfileFormDropdown from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormDropdown.vue";
import { useToast } from "vue-toastification";
import { inject, watch } from "vue";
import { editUserInjectionKey } from "@utils/injectionKeys";
import { useUserTagsStore } from "@stores/users/tags";
import { UserTagType } from "@/types/user";

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "success"]);
const { handleSubmit, isSubmitting, setErrors } = useForm({
  validationSchema: addNewTagFormSchema,
  validateOnMount: false,
});

const { userId } = inject(editUserInjectionKey)!;
const tagsStore = useUserTagsStore();
const { addTag } = tagsStore;

const submitHandler = handleSubmit(async (values) => {
  const { name, tag_type } = values as Record<string, string>;
  await addTag(userId, name, tag_type as UserTagType);
  emit("success");
  emit("close");
  useToast().success("Tag added successfully");
});

const tagTypeOptions = [
  { name: "User Tag", value: UserTagType.UserTag },
  { name: "Competency Tag", value: UserTagType.Competency },
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
        :value="UserTagType.UserTag"
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

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
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
