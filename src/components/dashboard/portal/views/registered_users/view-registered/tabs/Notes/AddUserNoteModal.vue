<script setup lang="ts">
import { useForm } from "vee-validate";
import { addNoteFormSchema } from "@utils/schemas";
import Button from "primevue/button";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import UserProfileTextArea from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileTextArea.vue";
import { useUserNotesStore } from "@stores/users/notes";
import { useToast } from "vue-toastification";
import { inject } from "vue";
import { editNewUserInjectionKey } from "@utils/injectionKeys";

interface Props {
  open: boolean;
}

const emit = defineEmits(["close", "success"]);
defineProps<Props>();

const { userId } = inject(editNewUserInjectionKey)!;
const notesStore = useUserNotesStore();
const { addNote } = notesStore;

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: addNoteFormSchema,
  validateOnMount: false,
});

const onSubmit = handleSubmit(
  async (values) => {
    const { title, description } = values;
    await addNote(userId, title, description);
    useToast().success("Note added Successfully!");
    emit("close");
  },
  (data) => console.log(data.errors)
);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-mask">
        <div
          class="modal-container relative bg-white w-full max-w-xl py-12 px-16 rounded"
          @click.stop
        >
          <div class="absolute top-3 right-4">
            <i class="pi pi-times cursor-pointer" @click="$emit('close')"></i>
          </div>
          <StyledHeading class="mb-12"> Add New Note </StyledHeading>
          <form
            class="flex flex-col gap-y-4 px-2 mx-auto"
            autocomplete="off"
            @submit.prevent="onSubmit"
          >
            <UserProfileFormTextField name="title" label="Title" />
            <UserProfileTextArea name="description" label="Description" />
            <Button
              :loading="isSubmitting"
              label="Add Note"
              type="submit"
              class="ml-auto"
            />
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
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
