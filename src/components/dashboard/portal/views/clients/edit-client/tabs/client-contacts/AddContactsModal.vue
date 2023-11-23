<script setup lang="ts">
import { useForm } from "vee-validate";
import { addClientContactFormSchema } from "@utils/schemas";
import Button from "primevue/button";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import { useClientContactsStore } from "@stores/clients/contacts";
import { useToast } from "vue-toastification";
import { inject } from "vue";
import { editClientInjectionKey } from "@utils/injectionKeys";

interface Props {
  open: boolean;
}

const emit = defineEmits(["close", "success"]);

defineProps<Props>();
const { clientId } = inject(editClientInjectionKey)!;
const contactsStore = useClientContactsStore();
const { addContact } = contactsStore;

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: addClientContactFormSchema,
  validateOnMount: false,
});

const onSubmit = handleSubmit(
  async (values) => {
    const { first_name, last_name, email, address, phone, title } = values;
    const success = await addContact(clientId, first_name, last_name, email, address, phone, title);

    if (!success) return;
    useToast().success("Contact added Successfully!");
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

          <StyledHeading class="mb-12"> Add New Contact </StyledHeading>

          <form
            class="flex flex-col gap-y-4 px-2 mx-auto"
            autocomplete="off"
            @submit.prevent="onSubmit"
          >
            <UserProfileFormTextField name="first_name" label="First Name" />
            <UserProfileFormTextField name="last_name" label="Last Name" />
            <UserProfileFormTextField name="email" label="Email" />
            <UserProfileFormTextField name="phone" label="Phone" />
            <UserProfileFormTextField name="address" label="Address" />
            <UserProfileFormTextField name="title" label="Title/Position" />

            <Button
              :loading="isSubmitting"
              label="Add Contact"
              type="submit"
              class="p-button p-button-primary w-full"
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
  overflow: scroll;
  overflow-x: hidden;
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
