<script setup lang="ts">
import { computed, onMounted } from "vue";
import TabView, { type TabViewClickEvent } from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import router, { DashboardRouteNames } from "@router";
import { useRoute } from "vue-router";
import MyobSettings from "@dashboard-views/settings/myob/MyobSettings.vue";
import EmailTemplate from "@dashboard-views/settings/email_settings/EmailTemplate.vue";
import QuoteEmailTemplate from "@dashboard-views/settings/email_settings/QuoteEmailTemplate.vue";
import ChangePassword from "@dashboard-views/settings/change_password/ChangePassword.vue";
import { useAuthStore } from "@stores/auth";
import { storeToRefs } from "pinia";

onMounted(() => {});

const tabQuery = useRoute().query["tab"]?.toString();
const activeTab = computed(() => (tabQuery ? parseInt(tabQuery) : 0));
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const onTabChange = (e: TabViewClickEvent) => {
  router.replace({
    name: DashboardRouteNames.settings,
    query: { tab: e.index },
  });
};
</script>

<template>
  <section class="mt-8">
    <div class="wrapper">
      <TabView
        class="my-4"
        @tab-change="onTabChange"
        :activeIndex="activeTab"
        lazy
      >
        <TabPanel header="Change Password"><ChangePassword /></TabPanel>
        <TabPanel v-if="user?.user_type === '1'" header="Connections"
          ><MyobSettings
        /></TabPanel>
        <TabPanel v-if="user?.user_type === '1'" header="Invoice Email Settings"
          ><EmailTemplate
        /></TabPanel>
        <TabPanel v-if="user?.user_type === '1'" header="Quote Email Settings"
          ><QuoteEmailTemplate
        /></TabPanel>
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
