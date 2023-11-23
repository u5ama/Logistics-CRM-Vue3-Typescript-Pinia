<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import type { FontWeight, FontSize } from "@app-types/styles";

type Variant = keyof typeof variantToElementMappings;

interface Props extends HTMLAttributes {
  variant?: Variant;
  weight?: FontWeight;
  size?: FontSize;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "text",
});

const variantToElementMappings = {
  text: "p",
  display: "h2",
  title: "h3",
  small_title: "h5",
  subtitle: "h5",
  subtitle2: "h5",
};

const variantClasses: Record<Variant, string[]> = {
  text: [],
  display: ["text-6xl", "font-bold"],
  title: ["text-2xl", "font-bold"],
  small_title: ["text-lg", "font-bold"],
  subtitle: ["text-base", "font-normal", "text-grey-400"],
  get subtitle2() {
    return [...this.subtitle, "text-grey-250"];
  },
};

const classes = computed(() => {
  const classArray: string[] = [
    props.variant,
    ...variantClasses[props.variant],
  ];

  if (props.size) classArray[1] = `text-${props.size}`;
  if (props.weight) classArray[2] = `font-${props.weight}`;

  return classArray;
});
</script>

<template>
  <component :is="variantToElementMappings[variant]" :class="classes">
    <slot></slot>
  </component>
</template>

<style lang="scss" scoped></style>
