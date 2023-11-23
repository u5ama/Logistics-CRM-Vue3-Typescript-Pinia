<script setup lang="ts">
import { FontSize, FontWeight } from "@app-types/styles";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import type { IUserActivity } from "@app-types/user";

interface Props {
  activity: IUserActivity;
}
defineProps<Props>();
</script>

<template>
  <div class="wrapper py-5">
    <div class="flex items-center mb-2">
      <WidgetTypography
        variant="subtitle"
        :weight="FontWeight.medium"
        :size="FontSize.xl"
        class="text-black mb-1"
      >
        <span class="tag">
          {{ activity.name }}
        </span>

        changed

        <span class="tag">
          {{ activity.field }}
        </span>

        from

        <span class="tag">
          {{ `${activity.oldValue}` }}
        </span>

        to

        <span class="tag">
          {{ activity.newValue }}
        </span>
      </WidgetTypography>
    </div>

    <div class="flex flex-col gap-y-2">
      <div class="flex gap-x-4">
        <WidgetTypography :size="FontSize.sm" variant="subtitle2">
          <i class="text-gray-600 pi pi-user mr-1"></i>
          <span>
            {{ activity.name }}
          </span>
        </WidgetTypography>
      </div>

      <WidgetTypography :size="FontSize.sm" variant="subtitle2">
        <i class="text-gray-600 pi pi-calendar mr-1"></i>
        <span>
          {{ new Date(activity.created_at) }}
        </span>
      </WidgetTypography>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper :deep(*) {
  .p-tag {
    @apply bg-slate-200 px-4;
  }

  .tag {
    @apply bg-slate-200 rounded-full px-2 py-1 font-semibold;
  }
}
</style>
