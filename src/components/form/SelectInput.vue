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
  value?: string;
  options: { value: string; text: string }[];
}

const props = defineProps<Props>();
const name = toRef(props, "name");
const { value, errorMessage, handleBlur, handleChange, meta } = useField(
  name,
  undefined,
  { initialValue: props.value, validateOnValueUpdate: false }
);
</script>

<template>
  <div
    class="flex flex-col"
    :class="{ 'has-error': !!errorMessage, success: meta.valid }"
  >
    <label class="font-medium" :for="name">{{ label }}</label>
    <select
      class="bg-white py-2 px-4 rounded border border-gray-500"
      :name="name"
      :id="name"
      :value="value"
      @change="handleChange"
      @blur="handleBlur"
      :="$attrs"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>

    <p class="text-sm text-red-500 mt-1">
      {{ errorMessage }}
    </p>
  </div>
</template>
