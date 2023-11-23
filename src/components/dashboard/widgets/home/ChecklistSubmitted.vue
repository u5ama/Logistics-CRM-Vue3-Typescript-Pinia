<script setup lang="ts">
import PortalWidget from "../PortalWidget.vue";
import WidgetTypography from "../WidgetTypography.vue";
import { FontWeight } from "@app-types/styles";
import { toRef } from "vue";

interface Props {
  value: number | 0;
  hours: string;
}

const props = defineProps<Props>();
const value = toRef(props, "value");
const hours = toRef(props, "hours");
</script>

<template>
  <PortalWidget primary>
    <div class="flex flex-col justify-between h-10">
      <div class="">
        <WidgetTypography variant="display" class="mb-3">
          {{ value }}
        </WidgetTypography>
        <WidgetTypography variant="title" :weight="FontWeight.normal">
          Checklist Submitted in {{ hours }}
        </WidgetTypography>
      </div>
    </div>
  </PortalWidget>
</template>
