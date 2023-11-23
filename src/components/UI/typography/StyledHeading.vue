<script setup lang="ts">
import type { HTMLAttributes } from "vue";

interface Props extends HTMLAttributes {
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

withDefaults(defineProps<Props>(), {
  level: "h1",
});
</script>

<template>
  <component :is="level" :class="level">
    <slot></slot>
  </component>
</template>

<style lang="scss" scoped>
.h1 {
  @apply text-grey-400 text-4xl font-bold;
}
.h3 {
  @apply text-2xl font-bold;
}
</style>
