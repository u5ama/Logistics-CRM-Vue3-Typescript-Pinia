<script setup lang="ts">
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { computed, ref, type FormHTMLAttributes } from "vue";
import { useLoading } from "@hooks";

interface Props extends FormHTMLAttributes {
  isEditing?: boolean;
  initialValue?: string;
}

interface Emits {
  (e: "submitted", value: string, cb: (value: string) => void): void;
  (e: "close"): void;
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  initialValue: "",
});

const emit = defineEmits<Emits>();

const {
  value: [submitText, submittingText],
} = computed<[string, string]>(() => {
  return props.isEditing ? ["Update", "Updating"] : ["Add", "Adding"];
});

const inputLabel = computed(() =>
  props.isEditing ? "Edit Address" : "New Address"
);

const inputValue = ref(props.initialValue);
const [isSubmitting, setSubmitting] = useLoading();
const submitHandler = () => {
  setSubmitting.start();

  emit("submitted", inputValue.value, () => {
    setSubmitting.stop();
    inputValue.value = "";
  });
};

const form = ref<HTMLFormElement | null>(null);
</script>

<template>
  <form
    action="#"
    autocomplete="off"
    @submit.prevent="submitHandler"
    ref="form"
  >
    <div class="p-inputgroup">
      <span class="p-float-label col-span-3">
        <InputText
          id="text-input"
          type="text"
          class="w-full p-inputtext-sm"
          v-model="inputValue"
        />
        <label for="text-input">{{ inputLabel }}</label>
      </span>
      <Button
        :label="isSubmitting ? submittingText : submitText"
        :icon="isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
        class="p-button-success p-button-sm"
        type="submit"
        :disabled="isSubmitting"
      />
      <Button
        v-if="isEditing"
        icon="pi pi-times"
        class="p-button-danger p-button-sm"
        v-tooltip.right="'Cancel'"
        @click="$emit('close')"
      />
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
