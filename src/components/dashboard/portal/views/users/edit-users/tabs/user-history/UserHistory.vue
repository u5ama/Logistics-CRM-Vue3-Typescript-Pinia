<script setup lang="ts">
import { useUserActivitiesStore } from "@stores/users/activities";
import { storeToRefs } from "pinia";
import { inject, onMounted } from "vue";
import Panel from "primevue/panel";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { editUserInjectionKey } from "@utils/injectionKeys";
import UserHistoryLog from "./UserHistoryLog.vue";
import { useLoading } from "@hooks";

const userActivitiesStore = useUserActivitiesStore();
const { activities } = storeToRefs(userActivitiesStore);
const { getActivities } = userActivitiesStore;
const { userId } = inject(editUserInjectionKey)!;
const [isLoading, setLoading] = useLoading();

const fetchActivities = async () => {
  setLoading.start();
  await getActivities(userId);
  setLoading.stop();
};

onMounted(async () => {
  if (!activities.value.length) await fetchActivities();
});
</script>

<template>
  <div class="wrapper max-w-6xl mt-6 mx-auto">
    <Panel>
      <template #header>
        <StyledHeading level="h3">User Timesheet History</StyledHeading>
      </template>

      <template #icons>
        <Button
          icon="pi pi-replay"
          class="p-button-rounded p-button-secondary -rotate-45"
          @click="fetchActivities"
          v-tooltip.top="'Reload Activities'"
        />
      </template>

      <SimpleLoader v-if="isLoading" />

      <WidgetTypography
        v-else-if="activities.length === 0"
        class="text-center mt-2"
      >
        No Records Found!
      </WidgetTypography>

      <div class="flex flex-col divide-y overflow-y-scroll" v-else>
        <UserHistoryLog
          v-for="activity in activities"
          :key="activity.id"
          :activity="activity"
        />
      </div>
    </Panel>
  </div>
</template>

<style lang="scss" scoped>
.wrapper :deep(*) {
  .p-panel-content {
    height: 500px;
    overflow-y: scroll;
  }
}
</style>
