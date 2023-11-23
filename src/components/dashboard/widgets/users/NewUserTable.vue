<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef } from "vue";
import { useUsersStore } from "@stores/users/users";
import router, { DashboardRouteNames } from "@router";
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import type { Header, Item } from "vue3-easy-data-table";
import DataTable from "@dashboard/ui/DataTable.vue";
import { mapUserTypeToString, mapUserActiveToString } from "@utils/helpers";
import { storeToRefs } from "pinia";
import { UserStatus, type IUser } from "@app-types/user";
import { useLoading, useModal } from "@hooks";
import Button from "primevue/button";

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);
const { newUsers, changeNewUserStatus } = usersStore;

onMounted(() => {
  newUsers();
});

const headers: Header[] = [
  { text: "ID", value: "id" },
  { text: "Full Name", value: "name", sortable: true },
  { text: "Email", value: "email", sortable: true },
  { text: "Status", value: "status", sortable: true },
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
  { icon: "pi pi-eye", tooltip: "View user", emit: "edit" },
  { icon: "pi pi-trash", tooltip: "Delete user" },
];

const [isModalOpen, setModal] = useModal();

const selectedUser = ref<IUser>();
const [isLoading, setLoading] = useLoading();

const reloadHandler = async () => {
  setLoading.start();
  await newUsers();
  setLoading.stop();
};

const ViewUserHandler = (userId: number) => {
  router.push({
    name: DashboardRouteNames.editRegUser,
    params: { id: userId }
  });
};

const statusChangeHandler = async (user: IUser) => {
  const newStatus =
    user.user_status === UserStatus.Active
      ? UserStatus.NotActive
      : UserStatus.Active;

  await changeNewUserStatus(user.id, newStatus);
  reloadHandler();
};

const searchQuery = ref("");
</script>

<template>
  <PortalWidget>
    <div class="flex justify-between mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          New Users
        </WidgetTypography>
        <WidgetTypography variant="subtitle" class="">
          All new registered users
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <Button
          icon="pi pi-replay"
          class="p-button-rounded p-button-secondary -rotate-45"
          @click="reloadHandler"
          v-tooltip.top="'Reload Data'"
          :loading="isLoading"
        />
      </div>
    </div>

    <div class="flex mb-2 justify-end">
      <div class="flex gap-2 items-center">
        <label class="font-medium" for="searchQuery">Search</label>
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
      @edit="ViewUserHandler"
      @status-change="statusChangeHandler"
      :hideFooter="false"
      :searchValue="searchQuery"
      buttonsPagination
    />
  </PortalWidget>
</template>

<style lang="scss" scoped></style>
