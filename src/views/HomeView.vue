<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "@stores/auth";
import DummyLayout from "@layouts/DummyLayout.vue";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>

<template>
  <DummyLayout>
    <main class="text-center">
      <h1 class="text-3xl font-bold mb-3">Homepage</h1>
      <p class="" v-if="user">
        Logged in as <span class="font-bold">{{ user.name }}</span>
      </p>
      <p v-else>Not Logged In</p>
    </main>
  </DummyLayout>
</template>
