<script setup lang="ts">
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
</script>

<template>
  <div class="flex justify-between items-center">
    <StyledHeading class="mb-8">Customer Management </StyledHeading>
  </div>
  <section class="widgets">
    <RouterView />
  </section>
</template>
