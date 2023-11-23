<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef } from "vue";
import { useUsersStore } from "@stores/users/users";
import router, { DashboardRouteNames } from "@router";
import PortalWidget from "../PortalWidget.vue";
import UserInfoModal from "./UserInfoModal.vue";
import WidgetTypography from "../WidgetTypography.vue";
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@dashboard/ui/DataTable.vue";
import { mapUserTypeToString, mapUserActiveToString } from "@utils/helpers";
import { storeToRefs } from "pinia";
import { UserStatus, type IUser } from "@app-types/user";
import { useToast } from "vue-toastification";
import { useLoading, useModal } from "@hooks";
import Button from "primevue/button";

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);
const { getAllUsers, changeUserStatus } = usersStore;

onMounted(() => {
  getAllUsers();
});

const headers: Header[] = [
  { text: "ID", value: "id" },
  { text: "Full Name", value: "name", sortable: true },
  { text: "Email", value: "email", sortable: true },
  { text: "Status", value: "status", sortable: true },
  { text: "Type", value: "type", sortable: true },
  { text: "Created At", value: "date_added" },
  { text: "Actions", value: "actions" },
];

const parsedItems = computed(() =>
  [...users.value]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((user) => ({
      status: mapUserActiveToString(user.user_status),
      type: mapUserTypeToString(user.user_type),
      date_added: new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(user.created_at)),
      ...user,
    }))
);

const items: ComputedRef<Item[]> = parsedItems;
const actions = [
  { icon: "pi pi-user-edit", tooltip: "Edit user", emit: "edit" },
  { icon: "pi pi-trash", tooltip: "Delete user" },
];

const [isModalOpen, setModal] = useModal();

const selectedUser = ref<IUser>();
const [isLoading, setLoading] = useLoading();

const reloadHandler = async () => {
  setLoading.start();
  await getAllUsers();
  setLoading.stop();
};

const addUserModal = () => {
  selectedUser.value = undefined;
  setModal.open();
};

const editUserHandler = (userId: number) => {
  router.push({
    name: DashboardRouteNames.editUser,
    params: { id: userId },
    query: { tab: 0 },
  });
};

const successHandler = () => {
  setModal.close();
  reloadHandler();
};

const updatedHandler = () => {
  useToast().success("User has successfully been updated!");
};

const addedHandler = () => {
  useToast().success("User has been successfully added!");
};

const statusChangeHandler = async (user: IUser) => {
  const newStatus =
    user.user_status === UserStatus.Active
      ? UserStatus.NotActive
      : UserStatus.Active;

  await changeUserStatus(user.id, newStatus);
  reloadHandler();
};

const searchQuery = ref("");
</script>

<template>
  <PortalWidget>
    <div class="flex justify-between mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          Users Information
        </WidgetTypography>
        <WidgetTypography variant="subtitle" class="">
          All registered users except admins
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          v-tooltip.left="'Add New User'"
          @click="addUserModal"
        />
        <Button
          icon="pi pi-replay"
          class="p-button-rounded p-button-secondary -rotate-45"
          @click="reloadHandler"
          v-tooltip.top="'Reload Data'"
          :loading="isLoading"
        />
      </div>
    </div>

    <UserInfoModal
      v-if="isModalOpen"
      :open="isModalOpen"
      :selectedUser="selectedUser"
      @close="setModal.close"
      @success="successHandler"
      @updated="updatedHandler"
      @added="addedHandler"
    />

    <div class="flex mb-2 justify-end">
      <div class="flex gap-2 items-center">
        <label class="font-medium" for="searchQuery">Search Users</label>
        <input
          class="rounded border border-gray-500 py-2 px-4"
          id="searchQuery"
          v-model="searchQuery"
        />
      </div>
    </div>

    <DataTable
      :loading="isLoading"
      :headers="headers"
      :items="items"
      :actions="actions"
      sort-by="date_added"
      @edit="editUserHandler"
      @status-change="statusChangeHandler"
      :hideFooter="false"
      :searchValue="searchQuery"
      buttonsPagination
    />
  </PortalWidget>
</template>

<style lang="scss" scoped></style>
