<script setup lang="ts">
interface Props {
  primary?: boolean;
}

withDefaults(defineProps<Props>(), {
  primary: false,
});
</script>

<template>
  <div class="widget" :class="{ primary }">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.widget {
  @apply relative bg-white px-8 py-12 overflow-hidden;

  box-shadow: 5px 5px 40px rgba(0, 0, 0, 0.039);
  border-radius: 40px;

  &.primary {
    @apply bg-brand text-white;

    :deep(*) {
      @apply text-white;
    }
  }
}
</style>
