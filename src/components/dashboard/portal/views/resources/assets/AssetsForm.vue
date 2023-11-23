<script setup lang="ts">
import { useForm } from "vee-validate";
import Button from "primevue/button";
import { ResourceTagType, type IResourceAsset } from "@app-types/resources";
import { assetsFormSchema } from "@utils/schemas";
import { onMounted, ref } from "vue";
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
import { useResourceAssetsStore } from "@stores/resources/assets";
import { useResourceSkillsStore } from "@stores/resources/skills";
import { useAttachmentsStore } from "@stores/resources/attachments";
import { useUsersStore } from "@stores/users/users";
import { API_BASE_URL } from "@utils/constants";
import { useChecklistsStore } from "@stores/checklists/checklists";

const resourceAssetsStore = useResourceAssetsStore();
const { asset } = storeToRefs(resourceAssetsStore);
const { addAsset, updateAsset, getAsset } = resourceAssetsStore;
const resourceTagsStore = useResourceTagsStore();
const resourceSkillsStore = useResourceSkillsStore();
const attachmentsStore = useAttachmentsStore();
const usersStore = useUsersStore();
const { attachments } = storeToRefs(attachmentsStore);
const { assetTags, competencyTags, resourceTags } =
  storeToRefs(resourceTagsStore);
const { skills } = storeToRefs(resourceSkillsStore);
const { users } = storeToRefs(usersStore);
const { getAllTags } = resourceTagsStore;
const { getAllSkills } = resourceSkillsStore;
const { getAllAttachments } = attachmentsStore;
const { getAllUsers } = usersStore;
const checklistsStore = useChecklistsStore();
const { checklists } = storeToRefs(checklistsStore);
const { getAllChecklists } = checklistsStore;
const assetId = parseInt(useRoute().params.id as string);
const isEditing = !!assetId;
const [isAssetLoading, setAssetLoading] = useLoading(isEditing);
const [isOptionsLoading, setOptionsLoading] = useLoading();

onMounted(async () => {
  setOptionsLoading.start();
  await getAllTags(ResourceTagType.Asset);
  await getAllTags(ResourceTagType.Competency);
  await getAllTags(ResourceTagType.Resource);
  await getAllSkills();
  await getAllAttachments();
  await getAllUsers();
  await getAllChecklists();
  setOptionsLoading.stop();

  if (isEditing) {
    await getAsset(assetId);
    updateFormValues();
  }
});

const updateFormValues = () => {
  if (asset.value) {
    const {
      photo,
      skills,
      tags,
      competencyTags,
      resourceTags,
      workers,
      attachments,
      checklists,

      ...fields
    } = asset.value;

    const toIds = (items: any[]) => items.map((i) => i.id);
    const toIdsString = (items: any[]) => toIds(items).join(",");

    setValues({
      ...fields,
      photo,
      tags: toIdsString(tags),
      competencyTags: toIdsString(competencyTags),
      resourceTags: toIdsString(resourceTags),
      skills: toIdsString(skills),
      workers: toIdsString(workers),
      asset_attachments: toIdsString(attachments),
      checklist: toIdsString(checklists),
    });

    selectedWorkers.value = toIds(workers);
    selectedSkills.value = toIds(skills);
    selectedAttachments.value = toIds(attachments);
    selectedTags.value = toIds(tags);
    selectedCompetencyTag.value = toIds(competencyTags);
    selectedResourceTag.value = toIds(resourceTags);
    selectedTags.value = toIds(tags);
    selectedChecklists.value = toIds(checklists);
    selectedPhotoUrl.value = `${API_BASE_URL}${photo}`;
    setAssetLoading.stop();
  }
};

const addHandler = async (asset: IResourceAsset) => {
  await addAsset(asset);
  useToast().success("Asset added successfully");
};

const updateHandler = async (asset: Partial<IResourceAsset>) => {
  await updateAsset(assetId, asset);
  useToast().success("Asset updated successfully");
  setAssetLoading.start();
  await getAsset(assetId);
  updateFormValues();
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: assetsFormSchema,
  validateOnMount: false,
});

const submitHandler = handleSubmit(
  async (values) => {
    const asset = values as IResourceAsset;

    if (isEditing) {
      await updateHandler(asset);
    } else {
      await addHandler(asset);
      resetFormHandler();
    }
  },
  ({ errors }) => console.log(errors)
);

const resetFormHandler = () => {
  resetForm();
  resetWorkers();
  resetSkills();
  resetAttachments();
  resetTags();
  removeFileHandler();
  resetChecklists();
  resetResourceTag();
  resetCompetencyTag();
};

const removeFileHandler = () => {
  selectedPhotoUrl.value = "";
};

const selectedPhotoUrl = ref<string>();

const [selectedWorkers, workersChangeHandler, resetWorkers] = useMultiSelect();
const [selectedSkills, skillsChangeHandler, resetSkills] = useMultiSelect();
const [selectedChecklists, checklistChangeHandler, resetChecklists] =
  useMultiSelect();
const [selectedAttachments, attachmentsChangeHandler, resetAttachments] =
  useMultiSelect();
const [selectedTags, tagsChangeHandler, resetTags] = useMultiSelect();
const [selectedResourceTag, resourceTagChangeHandler, resetResourceTag] =
  useMultiSelect();
const [selectedCompetencyTag, competencyTagChangeHandler, resetCompetencyTag] =
  useMultiSelect();
</script>

<template>
  <PortalWidget class="mt-6">
    <WidgetTypography variant="title" class="mb-2">
      {{ isEditing ? "Edit" : "Add" }} Asset
    </WidgetTypography>

    <div
      class="mt-8 flex flex-col gap-y-4"
      :class="{ 'loading-faded': isAssetLoading }"
    >
      <UserProfileFormTextField label="Asset Name" name="name" />
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
        label="Workers"
        name="workers"
        :items="users"
        :selectedItems="selectedWorkers"
        @change="workersChangeHandler"
        :loading="isOptionsLoading"
      />
      <MultiSelectDropdown
        label="Skills"
        name="skills"
        :items="skills"
        :selectedItems="selectedSkills"
        @change="skillsChangeHandler"
        :loading="isOptionsLoading"
      />
      <MultiSelectDropdown
        label="Asset Attachments"
        name="asset_attachments"
        :items="attachments"
        :selectedItems="selectedAttachments"
        @change="attachmentsChangeHandler"
        :loading="isOptionsLoading"
      />
      <MultiSelectDropdown
        label="Tags"
        name="tags"
        :items="assetTags"
        :selectedItems="selectedTags"
        @change="tagsChangeHandler"
        :loading="isOptionsLoading"
      />
      <MultiSelectDropdown
        label="Competency Tags"
        name="competencyTags"
        :items="competencyTags"
        :selectedItems="selectedCompetencyTag"
        @change="competencyTagChangeHandler"
        :loading="isOptionsLoading"
      />
      <MultiSelectDropdown
        label="Resource Tags"
        name="resourceTags"
        :items="resourceTags"
        :selectedItems="selectedResourceTag"
        @change="resourceTagChangeHandler"
        :loading="isOptionsLoading"
      />
<!--      <MultiSelectDropdown
        label="Subcontractors"
        name="subcontractors"
        :items="subcontractors"
        :selectedItems="selectedSubcontractors"
        @change="subcontractorsChangeHandler"
        :loading="isOptionsLoading"
      />-->
      <MultiSelectDropdown
        label="Checklists"
        name="checklists"
        :items="checklists"
        :selectedItems="selectedChecklists"
        @change="checklistChangeHandler"
        :loading="isOptionsLoading"
      />
      <UserProfileTextArea label="Comments" name="comments" />
    </div>

    <div class="flex lg:justify-end">
      <Button
        :label="isEditing ? 'Update Asset' : 'Save Asset'"
        icon="pi pi-save"
        class="p-button p-button-primary"
        :loading="isSubmitting"
        :disabled="isAssetLoading"
        @click="submitHandler"
      />
    </div>
  </PortalWidget>
</template>

<style lang="scss" scoped></style>
