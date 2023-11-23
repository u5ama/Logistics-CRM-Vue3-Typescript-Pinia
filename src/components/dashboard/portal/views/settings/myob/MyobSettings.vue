<script setup lang="ts">
import { onMounted, ref } from "vue";
import PortalWidget from "@dashboard/widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import { useLoading, useModal } from "@hooks";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import { MYOB_CLIENT_ID } from "@utils/constants";
import { MYOB_REDIRECT_URL } from "@utils/constants";
import { useSettingStore } from "@stores/settings";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import type { ISettings } from "@/types/settings";
import SettingsConfirmDeleteDialog from "@dashboard-views/settings/components/SettingsConfirmDeleteDialog.vue";
import DocusignSettings from "@dashboard-views/settings/docusign/DocusignSettings.vue";

const settingStore = useSettingStore();
const { settings } = storeToRefs(settingStore);
const { getAllSettings } = settingStore;

onMounted(() => {
  fetchData();
});

const linkUrl =
  "https://secure.myob.com/oauth2/account/authorize?client_id=" +
  MYOB_CLIENT_ID +
  "&redirect_uri=" +
  MYOB_REDIRECT_URL +
  "&response_type=code&scope=la.global";

const selectedItem = ref();
const [isDeleteModalOpen, deleteDialog] = useModal();

const fetchData = async () => {
  setLoading.start();
  await getAllSettings();
  setLoading.stop();
};

const disconnectMYOB = (item: ISettings) => {
  selectedItem.value = { ...item };
  deleteDialog.open();
};

const [isLoading, setLoading] = useLoading();
</script>

<template>
  <PortalWidget class="widget">
    <div class="flex justify-between items-center mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          Settings
        </WidgetTypography>
      </div>
    </div>

    <SimpleLoader class="mt-20" v-if="isLoading" />
    <div class="" v-else>
      <div v-if="settings">
        <div
          v-if="
            settings &&
            settings.connection_type === 'myob' &&
            settings.connection_status === 'active'
          "
        >
          <div class="mb-8">
            <WidgetTypography variant="title" class="mb-2 mt-16">
              MYOB is Connected
            </WidgetTypography>
          </div>
          <Button
            class="p-button-danger px-6 py-5 rounded text-white pt-5"
            icon="pi pi-times"
            label="Disconnect MYOB"
            @click="disconnectMYOB"
          />
        </div>
        <div v-else>
          <div class="mb-8">
            <WidgetTypography variant="title" class="mb-2 mt-16">
              Connect to MYOB
            </WidgetTypography>
          </div>
          <a
            :href="linkUrl"
            target="_blank"
            class="bg-brand px-6 py-5 rounded text-white pt-5"
            ><i class="pi pi-plus pr-3"></i>Connect to MYOB</a
          >
        </div>
      </div>
      <div v-else>
        <div class="mb-8">
          <WidgetTypography variant="title" class="mb-2 mt-16">
            Connect to MYOB
          </WidgetTypography>
        </div>
        <a
          :href="linkUrl"
          target="_blank"
          class="bg-brand px-6 py-5 rounded text-white pt-5"
          ><i class="pi pi-plus pr-3"></i>Connect to MYOB</a
        >
      </div>
    </div>
    <DocusignSettings></DocusignSettings>
    <div></div>
  </PortalWidget>
  <SettingsConfirmDeleteDialog
    :isOpen="isDeleteModalOpen"
    :selectedItem="selectedItem"
    @close="deleteDialog.close"
  />
</template>

<style lang="scss" scoped>
.widget {
  min-height: 500px;
}
</style>
