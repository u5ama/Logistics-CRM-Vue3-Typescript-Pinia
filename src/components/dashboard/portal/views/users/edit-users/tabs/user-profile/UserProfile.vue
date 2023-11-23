<script setup lang="ts">
import UserProfileForm from "./profile-form/UserProfileForm.vue";
import UserAddressesPanel from "./user-addresses/UserAddressesPanel.vue";
</script>

<template>
  <div class="wrapper flex flex-col py-8 gap-y-8 max-w-7xl mx-auto">
    <UserProfileForm />
    <UserAddressesPanel />
  </div>
</template>

<style lang="scss" scoped></style>
