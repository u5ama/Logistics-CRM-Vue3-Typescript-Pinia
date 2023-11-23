<script setup lang="ts">
import { useForm } from "vee-validate";
import Button from "primevue/button";
import { useQuoteFooterStore } from "@stores/quotes/footer";
import { addQuoteFooterFormSchema } from "@utils/schemas";
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useRoute } from "vue-router";
import { useLoading } from "@hooks";
import type { IQuoteFooter } from "@/types/quotes";
import QuoteEditor from "@dashboard/widgets/quotes/quoteEditor.vue";

const quoteFooterStore = useQuoteFooterStore();
const { quoteFooter } = storeToRefs(quoteFooterStore);
const { addQuoteFooter, updateQuoteFooter, getQuoteFooter } = quoteFooterStore;

const quoteFooterId = parseInt(useRoute().params.id as string);
const isEditing = !!quoteFooterId;
const [isAttachmentLoading, setAttachmentLoading] = useLoading(isEditing);

onMounted(async () => {
  if (isEditing) {
    await getQuoteFooter(quoteFooterId);
    updateFormValues();
  }
});
const updateFormValues = () => {
  if (quoteFooter.value) {
    const { ...fields } = quoteFooter.value;
    setValues({ ...fields });
    setAttachmentLoading.stop();
  }
};
const addHandler = async (quoteFooter: IQuoteFooter) => {
  await addQuoteFooter(quoteFooter);
  useToast().success("Quote Footer added successfully");
};
const updateHandler = async (quoteFooter: IQuoteFooter) => {
  await updateQuoteFooter(quoteFooterId, quoteFooter);
  useToast().success("Quote Footer updated successfully");
  setAttachmentLoading.start();
  await getQuoteFooter(quoteFooterId);
  updateFormValues();
};
const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: addQuoteFooterFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const quoteFooter = values as IQuoteFooter;
    if (isEditing) await updateHandler(quoteFooter);
    else {
      await addHandler(quoteFooter);
      resetFormHandler();
    }
  },
  ({ errors }) => console.log(errors)
);

const resetFormHandler = () => {
  resetForm();
};
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "Edit" : "Add" }} Quote Footer Template
    </WidgetTypography>

    <div
      class="mt-8 flex flex-col gap-y-4"
      :class="{ 'loading-faded': isAttachmentLoading }"
    >
      <UserProfileFormTextField label="Template Header" name="title" />
      <div>
        <label for="termsext-xs text-slate-500 ml-3 mb-2">
          Quote Footer Body
        </label>
        <br />
        <QuoteEditor name="description" class="mt-2" />
      </div>
    </div>
    <div class="flex lg:justify-end mt-5">
      <Button
        :label="isEditing ? 'Update Quote Footer' : 'Save Quote Footer'"
        icon="pi pi-save"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        :disabled="isAttachmentLoading"
        @click="submitHandler"
      />
    </div>
  </PortalWidget>
</template>

<style lang="scss" scoped></style>
