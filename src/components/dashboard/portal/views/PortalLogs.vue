<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useLogsStore } from "@stores/logs";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { FontSize, FontWeight } from "@app-types/styles";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import { useLoading } from "@hooks";
import Button from "primevue/button";

const logsStore = useLogsStore();
const { logs } = storeToRefs(logsStore);
const { getAllLogs } = logsStore;

// Fetch logs on component mount
onMounted(() => {
  reloadHandler();
});

// Use loading state and reload function
const [isLoading, setLoading] = useLoading();
const reloadHandler = async () => {
  setLoading.start();
  await getAllLogs();
  setLoading.stop();
};
</script>

<template>
  <!-- Heading for the activity logs section -->
  <StyledHeading class="mb-8"> Starbuck - Activity Logs </StyledHeading>

  <!-- Section containing the widgets -->
  <section class="widgets">
    <PortalWidget class="logs">
      <div class="flex justify-between mb-7">
        <div class="">
          <!-- Widget title -->
          <WidgetTypography variant="title" class="mb-1">
            Activity Logs
          </WidgetTypography>
          <!-- Widget subtitle -->
          <WidgetTypography variant="subtitle" class="">
            All activity recorded
          </WidgetTypography>
        </div>
        <div class="">
          <!-- Reload button -->
          <Button
              icon="pi pi-replay"
              class="p-button-rounded p-button-secondary -rotate-45"
              @click="reloadHandler"
              v-tooltip.top="'Reload Data'"
              :loading="isLoading"
          />
        </div>
      </div>

      <!-- Loading indicator -->
      <SimpleLoader v-if="isLoading" />

      <!-- Logs container -->
      <div class="flex flex-col divide-y h-[500px] overflow-y-scroll" v-else>
        <div v-for="log in logs" :key="log.id" class="py-5">
          <div class="flex items-center mb-2">
            <!-- Log subject -->
            <WidgetTypography
                variant="subtitle"
                :weight="FontWeight.medium"
                :size="FontSize.xl"
                class="text-black mb-1"
            >
              {{ log.subject }}
            </WidgetTypography>
            <!-- Log method badge -->
            <div
                class="ml-auto text-center border border-current text-xs text-yellow-500 bg-yellow-100 rounded-full w-12 mr-2"
            >
              {{ log.method }}
            </div>
          </div>
          <div class="flex flex-col gap-y-2">
            <div class="flex gap-x-4">
              <!-- Log username -->
              <WidgetTypography :size="FontSize.sm" variant="subtitle2">
                <i class="text-gray-600 pi pi-user mr-1"></i>
                <span>
                  {{ log.username }}
                </span>
              </WidgetTypography>
              <!-- Log IP address -->
              <WidgetTypography :size="FontSize.sm" variant="subtitle2">
                <i class="text-gray-600 pi pi-globe mr-1"></i>
                <span>
                  {{ log.ip }}
                </span>
              </WidgetTypography>
            </div>
            <!-- Log creation date -->
            <WidgetTypography :size="FontSize.sm" variant="subtitle2">
              <i class="text-gray-600 pi pi-calendar mr-1"></i>
              <span>
                {{ new Date(log.created_at) }}
              </span>
            </WidgetTypography>
            <!-- Log URL -->
            <WidgetTypography :size="FontSize.sm" variant="subtitle2">
              <i class="text-gray-600 pi pi-globe mr-1"></i>
              <span>
                {{ log.url }}
              </span>
            </WidgetTypography>
            <!-- Log agent -->
            <WidgetTypography :size="FontSize.sm" variant="subtitle2">
              <i class="text-gray-600 pi pi-desktop mr-1"></i>
              <span>
                {{ log.agent }}
              </span>
            </WidgetTypography>
          </div>
        </div>
      </div>
    </PortalWidget>
  </section>
</template>

<style lang="scss" scoped>
.widgets {
  /* Widget grid styling */
  @apply grid gap-8;

  .logs {
    /* Minimum height for logs widget */
    min-height: 400px;
  }
}
</style>
