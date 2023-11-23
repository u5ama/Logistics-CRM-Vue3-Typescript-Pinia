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

const { errorMessage, handleChange, meta, value } = useField(name, undefined, {
  type: "radio",
  checkedValue: props.value,
  validateOnValueUpdate: false,
});
</script>

<template>
  <div
    class="flex flex-col"
    :class="{ 'has-error': !!errorMessage, success: meta.valid }"
  >
    <p class="font-medium">{{ label }}</p>
    <div class="flex gap-x-4">
      <div
        class="option cursor-pointer"
        v-for="option in options"
        :key="option.value"
      >
        <input
          type="radio"
          class="mr-2"
          :checked="value === option.value"
          :name="name"
          :id="option.text"
          :value="option.value"
          @change="handleChange"
          :="$attrs"
        />
        <label :for="option.text" class="text-sm">{{ option.text }}</label>
      </div>
    </div>

    <p class="text-sm text-red-500 mt-1">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.option {
  * {
    cursor: inherit !important;
  }
}
</style>
