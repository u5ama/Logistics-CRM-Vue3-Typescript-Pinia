<script setup lang="ts">
import { useForm } from "vee-validate";
import Button from "primevue/button";
import { ResourceTagType, type IAssetAttachment } from "@app-types/resources";
import { useAttachmentsStore } from "@stores/resources/attachments";
import { attachmentFormSchema } from "@utils/schemas";
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import UserProfileFormTextField from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileFormTextField.vue";
import UserProfileTextArea from "@dashboard-views/users/edit-users/tabs/user-profile/profile-form/UserProfileTextArea.vue";
import { storeToRefs } from "pinia";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useRoute } from "vue-router";
import { useLoading, useMultiSelect } from "@hooks";
import MultiSelectDropdown from "@components/form/MultiSelectDropdown.vue";
import { useResourceTagsStore } from "@stores/resources/tags";

const attachmentsStore = useAttachmentsStore();
const { attachment } = storeToRefs(attachmentsStore);
const { addAttachment, updateAttachment, getAttachment } = attachmentsStore;
const resourceTagsStore = useResourceTagsStore();
const { attachmentTags } = storeToRefs(resourceTagsStore);
const { getAllTags } = resourceTagsStore;
const attachmentId = parseInt(useRoute().params.id as string);
const isEditing = !!attachmentId;
const [isAttachmentLoading, setAttachmentLoading] = useLoading(isEditing);
const [isOptionsLoading, setOptionsLoading] = useLoading();

onMounted(async () => {
  setOptionsLoading.start();
  await getAllTags(ResourceTagType.Attachment);
  setOptionsLoading.stop();

  if (isEditing) {
    await getAttachment(attachmentId);
    updateFormValues();
  }
});

const updateFormValues = () => {
  if (attachment.value) {
    const { tags, ...fields } = attachment.value;
    const tagIds = tags.map((t: any) => t.id);
    const tagsIdsString = tagIds.join(",");
    setValues({ ...fields, tags: tagsIdsString });
    selectedTags.value = tagIds;
    setAttachmentLoading.stop();
  }
};

const addHandler = async (attachment: IAssetAttachment) => {
  await addAttachment(attachment);
  useToast().success("Attachment added successfully");
};

const updateHandler = async (attachment: IAssetAttachment) => {
  await updateAttachment(attachmentId, attachment);
  useToast().success("Attachment updated successfully");
  setAttachmentLoading.start();
  await getAttachment(attachmentId);
  updateFormValues();
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: attachmentFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const attachment = values as IAssetAttachment;

    if (isEditing) await updateHandler(attachment);
    else {
      await addHandler(attachment);
      resetFormHandler();
    }
  },
  ({ errors }) => console.log(errors)
);

const resetFormHandler = () => {
  resetForm();
  selectedTags.value = [];
};

const [selectedTags, tagsChangeHandler] = useMultiSelect();
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "Edit" : "Add" }} Attachment
    </WidgetTypography>

    <div
      class="mt-8 flex flex-col gap-y-4"
      :class="{ 'loading-faded': isAttachmentLoading }"
    >
      <UserProfileFormTextField label="Asset Attachment Name" name="name" />
      <UserProfileFormTextField label="Description" name="description" />
      <div class="grid grid-cols-2 gap-2">
        <UserProfileFormTextField label="Rego Number" name="rego_number" />
        <UserProfileFormTextField label="Year" name="year" />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <UserProfileFormTextField label="Model" name="model" />
        <UserProfileFormTextField label="Make" name="make" />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <UserProfileFormTextField label="Serial Number" name="serial_number" />
        <UserProfileFormTextField
          label="Average Hourly Charge Rate"
          name="avg_hourly_rate"
        />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <UserProfileFormTextField
          label="Current Number Reading"
          name="current_number_reading"
        />
        <UserProfileFormTextField label="External ID" name="external_id" />
      </div>
      <MultiSelectDropdown
        label="Tags"
        name="tags"
        :items="attachmentTags"
        :selectedItems="selectedTags"
        @change="tagsChangeHandler"
        :loading="isOptionsLoading"
      />
      <UserProfileTextArea label="Comments" name="comments" />
    </div>
    <div class="flex lg:justify-end">
      <Button
        :label="isEditing ? 'Update Asset Attachment' : 'Save Asset Attachment'"
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
