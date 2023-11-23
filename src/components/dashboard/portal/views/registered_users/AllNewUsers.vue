<script setup lang="ts">
import NewUserTable from "@dashboard-widgets/users/NewUserTable.vue";
</script>

<template>
  <section class="widgets">
    <NewUserTable class="users" />
  </section>
</template>

<style lang="scss" scoped>
.widgets {
  @apply grid gap-8;
  .users {
    min-height: 400px;
  }
}
</style>
