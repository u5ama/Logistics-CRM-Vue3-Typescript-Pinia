<script setup lang="ts">
import { computed } from "vue";
import type { HTMLAttributes } from "vue";
import { useForm } from "vee-validate";
import { addUserFormSchema } from "@utils/schemas";
import ButtonVue from "@components/UI/ButtonVue.vue";
import TextInput from "@components/form/TextInput.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import SelectInput from "@components/form/SelectInput.vue";
import { useUsersStore } from "@stores/users/users";
import { UserType, type IUser } from "@app-types/user";
interface Props extends HTMLAttributes {
  open: boolean;
  selectedUser?: IUser;
}

const userStore = useUsersStore();
const { addUser } = userStore;

const emit = defineEmits(["close", "added", "updated", "success"]);
const props = defineProps<Props>();
const isEditing = computed(() => !!props.selectedUser);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: addUserFormSchema,
  validateOnMount: false,
  initialValues: props.selectedUser,
});

const submitHandler = handleSubmit(
  async (values) => {
    if (isEditing.value) {
      emit("updated");
    } else {
      await addUser(values);
      emit("success");
    }
  },
  (data) => console.log(data.errors)
);

const userTypeOptions = [
  { value: UserType.SuperAdmin, text: "Administrator" },
  { value: UserType.Accounts, text: "Accounts" },
  { value: UserType.Allocator, text: "Allocator" },
  { value: UserType.Sales, text: "Sales" },
  { value: UserType.Driver, text: "Driver" },
  { value: UserType.SafetyOfficer, text: "Safety Officer" },
];

const userRoleOptions = [
  { value: "admin", text: "Admin Role" },
  { value: "Accounts Role", text: "Accounts Role" },
  { value: "Allocator Role", text: "Allocator Role" },
  { value: "Sales Role", text: "Sales Role" },
  { value: "Drivers Role", text: "Drivers Role" },
  { value: "Safety Role", text: "Safety Role" },
];
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-mask">
        <div class="modal-container relative bg-white w-max py-8 px-16 rounded">
          <div class="absolute top-3 right-3">
            <i class="pi pi-times cursor-pointer" @click="$emit('close')"></i>
          </div>

          <StyledHeading class="mb-4">
            {{ isEditing ? "Edit User" : "Add New User" }}
          </StyledHeading>

          <form
            class="flex flex-col gap-y-4 px-4 max-w-xl mx-auto"
            autocomplete="off"
            @submit.prevent="submitHandler"
          >
            <TextInput
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
            />
            <TextInput
              label="Full Name"
              name="name"
              type="text"
              placeholder="Full Name"
            />
            <TextInput
              v-show="!isEditing"
              :value="isEditing ? 'password' : undefined"
              label="Password"
              name="password"
              type="password"
              placeholder="Password"
            />
            <SelectInput
              v-if="!isEditing"
              label="User Type"
              name="user_type"
              :value="UserType.Accounts"
              :options="userTypeOptions"
            />
            <SelectInput
              label="User Role"
              name="roles"
              :value="userRoleOptions[0].value"
              :options="userRoleOptions"
            />
            <ButtonVue class="ml-auto" type="submit" :disabled="isSubmitting">
              {{ isEditing ? "Update User" : "  Add User" }}
            </ButtonVue>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
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
