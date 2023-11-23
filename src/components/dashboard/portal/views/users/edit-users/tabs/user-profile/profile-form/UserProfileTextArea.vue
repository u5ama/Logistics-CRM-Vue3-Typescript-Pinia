<script setup lang="ts">
import { computed, toRef } from "vue";
import { useField } from "vee-validate";
import Textarea from "primevue/textarea";

interface Props {
  label: string;
  name: string;
  value?: string;
}

const props = defineProps<Props>();
const name = toRef(props, "name");
const { value, errorMessage, meta } = useField(name, undefined, {
  initialValue: props.value,
  validateOnValueUpdate: false,
});

const hasError = computed(() => !!errorMessage && meta.touched);
</script>

<template>
  <div>
    <span class="p-float-label">
      <Textarea
        class="w-full"
        :class="{ 'p-invalid': errorMessage }"
        :name="name"
        :id="name"
        :autoResize="true"
        rows="5"
        v-model="value"
      />
      <label :for="name">{{ label }}</label>
    </span>
    <small class="p-error" :class="{ invisible: !hasError }">
      {{ errorMessage || "&nbsp;" }}
    </small>
  </div>
</template>
