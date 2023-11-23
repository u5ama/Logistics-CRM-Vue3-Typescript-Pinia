<script setup lang="ts">
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import { FontWeight } from "@app-types/styles";
</script>

<template>
  <PortalWidget primary>
    <div class="flex flex-col justify-center h-full lg:px-6">
      <div class="">
        <WidgetTypography variant="display" class="mb-3">
          10,000,000m3
        </WidgetTypography>
        <WidgetTypography variant="title" :weight="FontWeight.normal">
          Soil Moved
        </WidgetTypography>
      </div>
    </div>
  </PortalWidget>
</template>
