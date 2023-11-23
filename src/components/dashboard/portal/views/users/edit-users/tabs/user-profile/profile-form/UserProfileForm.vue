<script setup lang="ts">
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import { useField, useForm } from "vee-validate";
import { userProfileFormSchema } from "@utils/schemas";
import UserProfileFormTextField from "./UserProfileFormTextField.vue";
import UserProfileFormDropdown from "./UserProfileFormDropdown.vue";
import type { IUserInfo } from "@app-types/user";
import { useUsersStore } from "@stores/users/users";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { computed, inject, onMounted } from "vue";
import { useUserRolesStore } from "@stores/users/roles";
import { editUserInjectionKey } from "@utils/injectionKeys";
import { useLoading } from "@hooks";

const userStore = useUsersStore();
const { updateUser } = userStore;
const rolesStore = useUserRolesStore();
const { roles } = storeToRefs(rolesStore);
const { getAllRoles } = rolesStore;
const { user, userId } = inject(editUserInjectionKey)!;
const [isProfileLoading, setProfileLoading] = useLoading(true);
const [isRolesLoading, setRolesLoading] = useLoading();

const fetchRoles = async () => {
  if (roles.value.length) return;

  setRolesLoading.start();
  await getAllRoles();
  setRolesLoading.stop();
};

onMounted(async () => {
  fetchRoles();
  updateFormValues();
});

userStore.$subscribe(() => updateFormValues());

const { handleSubmit, isSubmitting, setValues } = useForm({
  validationSchema: userProfileFormSchema,
});

const { value: birthDate, errorMessage: birthDateError } =
  useField<Date>("dob");

const titleOptions = [
  { name: "Mr.", value: "Mr." },
  { name: "Ms.", value: "Ms." },
  { name: "Mrs.", value: "Mrs." },
  { name: "Dr.", value: "Dr." },
];

const genderOptions = [
  { name: "Male", value: "Male" },
  { name: "Female", value: "Female" },
  { name: "Others", value: "Others" },
];

const roleOptions = computed(() =>
  roles.value.map((r) => ({
    name: r.name,
    value: r.id.toString(),
  }))
);

const defaultValues = {
  name: "",
  email: "",
  first_name: "",
  preferredName: "",
  middle_name: "",
  last_name: "",
  phone: "",
  tax_file_number: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  title: titleOptions[0].value,
  gender: genderOptions[0].value,
};

const updateFormValues = () => {
  if (user.value) {
    const { name, email, userRole } = user.value;

    if (user.value.user_profile) {
      const { dob } = user.value.user_profile;

      const values: Record<string, any> = {
        ...user.value.user_profile,
        name,
        email,
        roles: userRole.length > 0 ? userRole[0].id.toString() : "",
        dob: new Date(dob),
      };

      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          if (values[key] === null) values[key] = "";
        }
      }
      setValues(values);
    } else {
      const values = {
        ...defaultValues,
        email,
        name,
      };
      setValues(values);
    }
    setProfileLoading.stop();
  }
};

const onSubmit = handleSubmit(
  async (values) => {
    const {
      name,
      roles,
      email,
      title,
      first_name,
      preferredName,
      middle_name,
      last_name,
      phone,
      gender,
      tax_file_number,
      emergency_contact_name,
      emergency_contact_phone,
    } = values as Record<string, string>;

    const dob = values["dob"] as Date;

    const userInfo: IUserInfo = {
      name,
      roles,
      email,
      title,
      dob,
      first_name,
      preferredName,
      middle_name,
      last_name,
      phone,
      gender,
      tax_file_number,
      emergency_contact_name,
      emergency_contact_phone,
    };

    await updateUser(userId, userInfo);
    useToast().success("User updated Successfully!");
  },
  ({ errors }) => {
    console.log(errors);
  }
);
</script>

<template>
  <form
    action="#"
    class="grid lg:grid-cols-12 sm:grid-cols-12 items-end gap-y-2 gap-x-5"
    :class="{ 'loading-faded': isProfileLoading }"
    autocomplete="off"
    @submit.prevent="onSubmit"
  >
    <UserProfileFormDropdown
      class="col-span-1"
      label="Title"
      name="title"
      :options="titleOptions"
      :value="defaultValues.title"
    />

    <UserProfileFormTextField
      class="col-span-3"
      label="First Name"
      name="first_name"
    />

    <UserProfileFormTextField
      class="col-span-2"
      label="Preferred Name"
      name="preferredName"
    />

    <UserProfileFormTextField
      class="col-span-3"
      label="Middle Name"
      name="middle_name"
    />

    <UserProfileFormTextField
      class="col-span-3"
      label="Last Name"
      name="last_name"
    />

    <UserProfileFormDropdown
      class="col-span-6"
      label="User Role"
      name="roles"
      :options="roleOptions"
      :loading="isRolesLoading"
    />

    <UserProfileFormTextField class="col-span-6" label="Email" name="email" />

    <UserProfileFormTextField class="col-span-6" label="Phone" name="phone" />

    <div class="col-span-3">
      <span class="p-float-label">
        <Calendar v-model="birthDate" inputId="birth-date" class="w-full" />
        <label for="birth-date">Birth Date</label>
      </span>
      <small class="p-error" :class="{ invisible: !birthDateError }">
        {{ birthDateError || "&nbsp;" }}
      </small>
    </div>

    <UserProfileFormDropdown
      class="col-span-3"
      label="Gender"
      name="gender"
      :options="genderOptions"
      :value="defaultValues.gender"
    />

    <UserProfileFormTextField
      class="col-span-6"
      label="Tax File Number"
      name="tax_file_number"
    />

    <UserProfileFormTextField
      class="col-span-6"
      label="Emergency Contact Name"
      name="emergency_contact_name"
    />

    <UserProfileFormTextField
      class="col-span-6"
      label="Emergency Contact Phone"
      name="emergency_contact_phone"
    />
    <br />
    <Button
      :loading="isSubmitting"
      label="Update"
      type="submit"
      class="col-span-6"
    />
  </form>
</template>

<style lang="scss" scoped>
:deep(.p-dropdown-label) {
  text-overflow: initial;
}
</style>
