<script setup lang="ts">
import UserTable from "@dashboard-widgets/users/UserTable.vue";
</script>

<template>
  <section class="widgets">
    <UserTable class="users" />
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
