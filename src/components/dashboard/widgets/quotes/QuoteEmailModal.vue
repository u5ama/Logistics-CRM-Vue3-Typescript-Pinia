<script setup lang="ts">
import { onMounted } from "vue";
import type { HTMLAttributes } from "vue";
import { useForm } from "vee-validate";
import { quoteSettingFormSchema } from "@utils/schemas";
import ButtonVue from "@components/UI/ButtonVue.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";

import { useUsersStore } from "@stores/users/users";
import { useQuoteSettingsStore } from "@stores/quotes/quoteSettings";

import { type IQuoteSettings } from "@app-types/quoteSettings";
import MultiSelectDropdown from "@components/form/MultiSelectDropdown.vue";
import { storeToRefs } from "pinia";
import { useMultiSelect } from "@hooks";
import QuoteEditor from "@dashboard/widgets/quotes/quoteEditor.vue";
import { useRoute } from "vue-router";
interface Props extends HTMLAttributes {
  open: boolean;
  selectedQuote?: IQuoteSettings;
}

onMounted(async () => {
  await getAllUsers();
  if (isEditing) {
    await getQuoteSetting(quoteId);
    updateFormValues();
  }
});

const userStore = useUsersStore();
const { users } = storeToRefs(userStore);
const { getAllUsers } = userStore;

const quoteSettingsStore = useQuoteSettingsStore();
const { sendQuoteSettingsEmail, getQuoteSetting } = quoteSettingsStore;
const { quoteSetting } = storeToRefs(quoteSettingsStore);

const emit = defineEmits(["close", "added", "updated", "success"]);
const props = defineProps<Props>();

const quoteId = parseInt(useRoute().params.id as string);
const isEditing = !!quoteId;

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: quoteSettingFormSchema,
  validateOnMount: false,
  initialValues: props.selectedQuote,
});

const updateFormValues = () => {
  if (quoteSetting.value) {
    const { ...fields } = quoteSetting.value;
    setValues({ ...fields });
  }
};

const submitHandler = handleSubmit(
  async (values) => {
    await sendQuoteSettingsEmail(values);
    resetFormHandler();
    emit("success");
  },
  (data) => console.log(data.errors)
);
const [selectedUsers, userChangeHandler, resetUser] = useMultiSelect();
const resetFormHandler = () => {
  resetForm();
  resetUser();
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-mask">
        <div class="modal-container relative bg-white w-max py-8 px-16 rounded">
          <div class="absolute top-3 right-3">
            <i class="pi pi-times cursor-pointer" @click="$emit('close')"></i>
          </div>

          <StyledHeading class="mb-4">
            {{ isEditing ? "Send Email" : "Send Email" }}
          </StyledHeading>

          <form
            class="flex flex-col gap-y-4 px-4 max-w-xl mx-auto mt-8"
            autocomplete="off"
            @submit.prevent="submitHandler"
          >
            <MultiSelectDropdown
              class="w-full"
              label="Select Users"
              name="user_ids"
              :items="users"
              :selectedItems="selectedUsers"
              @change="userChangeHandler"
            />
            <div>
              <label
                for="terms_conditions"
                class="inline-block text-xs text-slate-500 ml-3 mb-2"
              >
                Terms Conditions
              </label>
              <br />
              <QuoteEditor
                name="terms_conditions"
                :value="quoteSetting?.terms_conditions"
              />
            </div>
            <ButtonVue class="ml-auto" type="submit" :disabled="isSubmitting">
              {{ isEditing ? "Send" : "  Send" }}
            </ButtonVue>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-mask {
  overflow-y: scroll;
  position: fixed;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
  display: grid;
  place-items: center;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(1.1);
}
</style>
