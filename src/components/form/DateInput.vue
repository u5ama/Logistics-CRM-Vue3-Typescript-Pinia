<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { toRef } from "vue";
import { useField } from "vee-validate";
import type { InputHTMLAttributes } from "vue";

interface Props extends InputHTMLAttributes {
  label: string;
  name: string;
  inline?: boolean;
  value?: string;
}

const props = defineProps<Props>();
const name = toRef(props, "name");
const { value, errorMessage, handleBlur, handleChange, meta } = useField(
  name,
  undefined,
  { initialValue: props.value, validateOnValueUpdate: false }
);
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = (today.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so we add 1
  let day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
</script>

<template>
  <div
    class="flex gap-2"
    :class="{
      'has-error': !!errorMessage,
      success: meta.valid,
      'flex-col': !inline,
      'items-center': inline,
    }"
  >
    <label class="font-medium" :for="name">{{ label }}</label>
    <input
      class="rounded border border-gray-500 py-2 px-4"
      type="date"
      :name="name"
      :id="name"
      :value="value"
      @change="handleChange"
      @blur="handleBlur"
      :min="getCurrentDate()"
      :="$attrs"
    />

    <p class="text-sm text-red-500 mt-1" v-show="errorMessage && meta.touched">
      {{ errorMessage }}
    </p>
  </div>
</template>
