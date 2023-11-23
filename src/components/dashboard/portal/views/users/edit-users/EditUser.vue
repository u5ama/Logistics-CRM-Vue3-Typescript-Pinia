<script setup lang="ts">
import { onMounted, computed, onUnmounted, provide } from "vue";
import { useUsersStore } from "@stores/users/users";
import Skeleton from "primevue/skeleton";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { FontSize, FontWeight } from "@app-types/styles";
import router, { DashboardRouteNames } from "@router";
import UserProfile from "./tabs/user-profile/UserProfile.vue";
import UserHistory from "./tabs/user-history/UserHistory.vue";
import UserNotes from "./tabs/user-notes/UserNotes.vue";
import UserDocuments from "./tabs/user-documents/UserDocuments.vue";
import { editUserInjectionKey } from "@utils/injectionKeys";
import { useUserNotesStore } from "@stores/users/notes";
import { generateFullName } from "@utils/helpers";
import UserTags from "@dashboard-views/users/edit-users/tabs/user-tags/UserTags.vue";

const usersStore = useUsersStore();
const notesStore = useUserNotesStore();
const { totalNotes, didFetchNotes } = storeToRefs(notesStore);
const { user } = storeToRefs(usersStore);
const { getUser } = usersStore;
const userId = parseInt(useRoute().params.id as string);
const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));

onMounted(() => {
  getUser(userId);
});

onUnmounted(() => {
  user.value = undefined;
});

provide(editUserInjectionKey, { user, userId });

const fullName = computed(() => {
  if (user.value && user.value.user_profile) {
    const { title, first_name, middle_name, last_name } =
      user.value.user_profile;

    return generateFullName(title, first_name, middle_name, last_name);
  }
  return "";
});

const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.editUser,
    params: { id: userId },
    query: { tab: e.index },
  });
};

const notesHeaderTitle = computed(() => {
  const totalNumber = didFetchNotes.value
    ? totalNotes.value
    : user.value?.total_notes || 0;

  return `Notes (${totalNumber})`;
});
</script>

<template>
  <RouterLink
    class="hover:underline text-sm"
    :to="{ name: DashboardRouteNames.allUsers }"
  >
    <i class="pi pi-arrow-left text-xs mr-1"></i> Back to All Users
  </RouterLink>

  <section class="mt-8">
    <div class="mb-10">
      <WidgetTypography
        variant="title"
        :size="FontSize.xl4"
        :weight="FontWeight.medium"
        v-if="user"
      >
        {{ fullName || user?.name }}
      </WidgetTypography>
      <Skeleton height="40px" width="700px" v-else></Skeleton>
    </div>
    <div class="wrapper">
      <TabView
        class="my-4"
        :scrollable="true"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Profile"> <UserProfile /> </TabPanel>
        <TabPanel :header="notesHeaderTitle"> <UserNotes /> </TabPanel>
        <TabPanel header="History"> <UserHistory /> </TabPanel>
        <TabPanel header="Timesheets"> <UserHistory /> </TabPanel>
        <TabPanel header="Documents"> <UserDocuments /> </TabPanel>
        <TabPanel header="Tags"> <UserTags /> </TabPanel>
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
