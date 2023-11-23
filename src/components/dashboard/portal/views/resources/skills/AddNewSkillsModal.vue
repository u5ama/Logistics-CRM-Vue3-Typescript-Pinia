<script setup lang="ts">
import { useForm } from "vee-validate";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import { addNewSkillFormSchema } from "@utils/schemas";
import { useResourceSkillsStore } from "@stores/resources/skills";
import { useToast } from "vue-toastification";
import { watch } from "vue";

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "success"]);
const { handleSubmit, isSubmitting, setErrors } = useForm({
  validationSchema: addNewSkillFormSchema,
  validateOnMount: false,
});
const skillsStore = useResourceSkillsStore();
const { addNewSkill } = skillsStore;

const submitHandler = handleSubmit(async (values) => {
  const { name } = values as Record<string, string>;
  await addNewSkill(name);
  emit("success");
  emit("close");
  useToast().success("Skill added successfully");
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
    :header="'Add New Skill'"
    :modal="true"
    class="p-fluid"
    :closable="false"
  >
    <div class="mt-8 flex flex-col gap-y-4" v-if="isOpen">
      <UserProfileFormTextField label="Skill Name" name="name" />
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
        :label="'Add Skill'"
        icon="pi pi-check"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        @click="submitHandler"
      />
    </template>
  </Dialog>
</template>

<style lang="scss" scoped></style>
