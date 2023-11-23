<script setup lang="ts">
import { onMounted, ref } from "vue";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Fieldset from "primevue/fieldset";
import { useUserRolesStore } from "@stores/users/roles";
import type { IUserPermission, IUserRole } from "@app-types/user";
import { useLoading } from "@hooks";

interface Props {
  role: IUserRole;
  allPermissions: IUserPermission[];
}

const props = defineProps<Props>();
const rolesStore = useUserRolesStore();
const { getRolePermissions, updateRole } = rolesStore;
const selectedPermissions = ref<string[]>([]);
const [isLoading, setLoading] = useLoading();
const [isUpdating, setUpdating] = useLoading();
const fetchRolePermissions = async () => {
  setLoading.start();
  const roleAndPermissions = await getRolePermissions(props.role.id);
  selectedPermissions.value = roleAndPermissions!.role.permissions.map(
    (p) => p.name
  );
  setLoading.stop();
};

onMounted(async () => {
  await fetchRolePermissions();
});

const updateRoleHandler = async () => {
  setUpdating.start();
  await updateRole(props.role.id, props.role.name, selectedPermissions.value);
  await fetchRolePermissions();
  setUpdating.stop();
};
</script>

<template>
  <Fieldset :legend="role.name" :toggleable="true" :collapsed="true">
    <h4 class="font-medium text-xl mb-1">Edit Role Permissions</h4>
    <div
      class="flex gap-x-4 gap-y-4 flex-wrap py-4"
      :class="{ 'loading-faded': isLoading }"
    >
      <div
        class="field-checkbox"
        v-for="{ id, name } in allPermissions"
        :key="id"
      >
        <Checkbox
          :inputId="`${role.id}-${id}`"
          name="permissions"
          :value="name"
          v-model="selectedPermissions"
        />
        <label :for="`${role.id}-${id}`" class="ml-2">{{ name }}</label>
      </div>
    </div>

    <div class="flex items-center justify-end">
      <Button
        class="p-button-success"
        :label="isUpdating ? 'Updating' : 'Update Role Permissions'"
        :icon="isUpdating ? 'pi pi-spin pi-spinner' : ''"
        :disabled="isUpdating"
        @click="updateRoleHandler"
      />
    </div>
  </Fieldset>
</template>

<style lang="scss" scoped></style>
