<script setup lang="ts">
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import { FontWeight } from "@app-types/styles";

const progress = 72;
</script>

<template>
  <PortalWidget primary>
    <div class="flex flex-col justify-between h-full">
      <div class="">
        <WidgetTypography variant="display" class="mb-3"> 47 </WidgetTypography>
        <WidgetTypography variant="title" :weight="FontWeight.normal">
          Active Projects
        </WidgetTypography>
      </div>

      <div class="">
        <div
          class="relative h-4 bg-white bg-opacity-50 rounded-full overflow-hidden mb-6"
        >
          <div
            :style="{ width: `${progress}%` }"
            class="absolute left-0 top-0 h-full bg-white rounded-full"
          ></div>
        </div>

        <div class="flex justify-between">
          <WidgetTypography variant="subtitle">11 Pending</WidgetTypography>
          <WidgetTypography variant="subtitle">
            {{ progress }}%
          </WidgetTypography>
        </div>
      </div>
    </div>
  </PortalWidget>
</template>
