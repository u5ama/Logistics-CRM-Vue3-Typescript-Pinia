<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue";

interface Props extends ButtonHTMLAttributes {}

defineProps<Props>();
</script>

<template>
  <button
    class="bg-brand px-4 py-2 rounded disabled:cursor-not-allowed disabled:opacity-60"
    style="color: white; font-weight: bold;"
  >
    <slot></slot>
  </button>
</template>
