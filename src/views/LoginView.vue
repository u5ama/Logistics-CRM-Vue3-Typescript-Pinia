<script setup lang="ts">
import { useForm } from "vee-validate";
import { useAuthStore } from "@stores/auth";
import ButtonVue from "@components/UI/ButtonVue.vue";
import DummyLayout from "@layouts/DummyLayout.vue";
import TextInput from "@components/form/TextInput.vue";
import { loginFormSchema } from "@utils/schemas";
import { storeToRefs } from "pinia";
import { starbuckLogoBlack } from "@images";

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: loginFormSchema,
});

const onSubmit = handleSubmit(async (values) => {
  const { email, password } = values;
  await login(email, password);
});

const authStore = useAuthStore();
const { error } = storeToRefs(authStore);
const { login } = authStore;
</script>

<template>
  <DummyLayout>
    <main>
      <div class="flex max-w-sm mx-auto">
        <RouterLink to="/">
          <img class="w-62" :src="starbuckLogoBlack" alt="starbuck logo" />
        </RouterLink>
      </div>
      <form
        class="flex flex-col gap-y-4 px-4 max-w-sm mx-auto"
        action="#"
        autocomplete="off"
        @submit.prevent="onSubmit"
      >
        <TextInput
          label="Email"
          name="email"
          type="email"
          placeholder="Email"
        />
        <TextInput
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
        />
        <p class="text-red-500 text-right" v-if="error">
          {{ error }}
        </p>
        <ButtonVue
          class="ml-auto w-full"
          type="submit"
          :disabled="isSubmitting"
        >
          Login
        </ButtonVue>
         <p class="text-gray-600 text-sm text-center">
          Don't have an account?
          <RouterLink class="font-semibold underline" to="/signup"
            >Signup Here</RouterLink
          >
        </p>
      </form>
    </main>
  </DummyLayout>
</template>
