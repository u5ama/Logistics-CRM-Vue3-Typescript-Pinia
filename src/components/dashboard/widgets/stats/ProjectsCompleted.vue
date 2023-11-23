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
          1,143
        </WidgetTypography>
        <WidgetTypography variant="title" :weight="FontWeight.normal">
          Projects Completed
        </WidgetTypography>
      </div>
    </div>
  </PortalWidget>
</template>
