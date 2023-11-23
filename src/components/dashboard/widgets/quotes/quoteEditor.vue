<script setup lang="ts">
import { toRef } from "vue";
import { useField } from "vee-validate";
import Editor from "primevue/editor";

interface Props {
  label?: string;
  name: string;
  value?: string;
}

const props = defineProps<Props>();
const name = toRef(props, "name");
const { value } = useField(name, undefined, {
  initialValue: props.value,
  validateOnValueUpdate: false,
});
</script>

<template>
  <div>
    <Editor v-model="value" :name="name" :id="name" />
  </div>
</template>
