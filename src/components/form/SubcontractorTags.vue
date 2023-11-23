<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { toRef } from "vue";
import { useField } from "vee-validate";
import type { InputHTMLAttributes } from "vue";
import Chips from "primevue/chips";

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
    <Chips
      v-model="value"
      :name="name"
      :id="name"
      :value="value"
      @change="handleChange"
      @blur="handleBlur"
      :="$attrs"
    />

    <p class="text-sm text-red-500 mt-1" v-show="errorMessage && meta.touched">
      {{ errorMessage }}
    </p>
  </div>
</template>
