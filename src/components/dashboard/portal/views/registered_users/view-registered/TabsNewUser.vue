<script setup lang="ts">
import { useRoute } from "vue-router";
import router, { DashboardRouteNames } from "@router";
import { computed, onMounted, provide } from "vue";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import ViewNewUsers from "@dashboard-views/registered_users/view-registered/ViewNewUsers.vue";
import UserNotes from "@dashboard-views/registered_users/view-registered/tabs/Notes/UserNotes.vue";
import { editNewUserInjectionKey } from "@utils/injectionKeys";
import { useUsersStore } from "@stores/users/users";
import { storeToRefs } from "pinia";

const userId = parseInt(useRoute().params.id as string);

const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));

const usersStore = useUsersStore();
const { newUser } = storeToRefs(usersStore);
const { getNewUser } = usersStore;
onMounted(async () => {
  await getNewUser(userId);
});
// console.log(newUser);
provide(editNewUserInjectionKey, { newUser, userId });

const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.editRegUser,
    params: { id: userId },
    query: { tab: e.index },
  });
};
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.registeredUsers }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Users
  </RouterLink>
  <section class="mt-8">
    <div class="wrapper">
      <TabView
        class="my-4"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Application"><ViewNewUsers /></TabPanel>
        <TabPanel header="Notes"><UserNotes /></TabPanel>
      </TabView>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.wrapper :deep(*) {
  &.p-tabview {
    @apply rounded overflow-hidden;

    &-nav {
      @apply bg-transparent justify-center;

      &-link {
        @apply grid place-content-center;
      }
    }
    &-header {
      min-width: 144px;
    }
    &-panels {
      @apply bg-transparent;
    }
  }
}
</style>
