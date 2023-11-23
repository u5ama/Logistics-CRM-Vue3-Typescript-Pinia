<script setup lang="ts">
import { onMounted, ref } from "vue";
import Panel from "primevue/panel";
import RolePanel from "./RolePanel.vue";
import { storeToRefs } from "pinia";
import { useUserRolesStore } from "@stores/users/roles";
import { useUserPermissionsStore } from "@stores/users/permissions";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import { useLoading } from "@hooks";
import { DashboardRouteNames } from "@router";

const rolesStore = useUserRolesStore();
const permissionsStore = useUserPermissionsStore();
const { roles } = storeToRefs(rolesStore);
const { permissions } = storeToRefs(permissionsStore);
const { getAllRoles } = rolesStore;
const { getAllPermissions } = permissionsStore;
const [isLoading, setLoading] = useLoading();

const fetchRolesAndPermissions = async () => {
  setLoading.start();
  await Promise.all([getAllRoles(), getAllPermissions()]);
  setLoading.stop();
};

onMounted(async () => {
  if (!roles.value.length) await fetchRolesAndPermissions();
});

const selectedPermissions = ref<Record<string, any>>({});

roles.value.forEach((role) => (selectedPermissions.value[role.name] = []));
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allUsers }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Users
  </RouterLink>
  <Panel header="User Roles" class="mt-8">
    <template #icons>
      <Button
        icon="pi pi-replay"
        class="p-button-rounded p-button-secondary -rotate-45"
        @click="fetchRolesAndPermissions"
        v-tooltip.top="'Reload Data'"
      />
    </template>

    <SimpleLoader v-if="isLoading" />

    <div class="flex flex-col gap-y-6" v-else>
      <RolePanel
        :role="role"
        :allPermissions="permissions"
        v-for="role in roles"
        :key="role.id"
      />
    </div>
  </Panel>
</template>

<style lang="scss" scoped></style>
