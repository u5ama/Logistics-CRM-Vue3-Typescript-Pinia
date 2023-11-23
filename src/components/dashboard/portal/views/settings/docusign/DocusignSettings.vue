<script setup lang="ts">
import { onMounted, ref } from "vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useLoading, useModal } from "@hooks";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import { DOCUSIGN_CLIENT_ID } from "@utils/constants";
import { DOCUSIGN_REDIRECT_URL } from "@utils/constants";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import type { ISettings } from "@/types/settings";
import { useDocusignSettingStore } from "@stores/docusignSettings";
import DocusignConfirmDeleteDialog from "@dashboard-views/settings/components/DocusignConfirmDeleteDialog.vue";

const docusignSettingStore = useDocusignSettingStore();
const { docusignSettings } = storeToRefs(docusignSettingStore);
const { getDocusignSettings } = docusignSettingStore;

onMounted(() => {
  fetchData();
});

const linkUrl =
  "https://account-d.docusign.com/oauth/auth?client_id="+
  DOCUSIGN_CLIENT_ID+
  "&redirect_uri="+
  DOCUSIGN_REDIRECT_URL+
  "&response_type=code&scope=signature";

const selectedItem = ref();
const [isDeleteModalOpen, deleteDialog] = useModal();

const fetchData = async () => {
  setLoading.start();
  await getDocusignSettings();
  setLoading.stop();
};

const disconnectDocusign = (item: ISettings) => {
  selectedItem.value = { ...item };
  deleteDialog.open();
};

const [isLoading, setLoading] = useLoading();
</script>

<template>
  <div class="widget" style="padding: 0">
    <SimpleLoader class="mt-20" v-if="isLoading" />
    <div class="" v-else>
      <div v-if="docusignSettings">
        <div
          v-if="
            docusignSettings &&
            docusignSettings.connection_type === 'docusign' &&
            docusignSettings.connection_status === 'active'
          "
        >
          <div class="mb-8">
            <WidgetTypography variant="title" class="mb-2 mt-16">
              Docusign is Connected
            </WidgetTypography>
          </div>
          <Button
            class="p-button-danger px-6 py-5 rounded text-white pt-5"
            icon="pi pi-times"
            label="Disconnect Docusign"
            @click="disconnectDocusign"
          />
        </div>
        <div v-else>
          <div class="mb-8">
            <WidgetTypography variant="title" class="mb-2 mt-16">
              Connect to Docusign
            </WidgetTypography>
          </div>
          <a
            :href="linkUrl"
            target="_blank"
            class="bg-brand px-6 py-5 rounded text-white pt-5"
            ><i class="pi pi-plus pr-3"></i>Connect to Docusign</a
          >
        </div>
      </div>
      <div v-else>
        <div class="mb-8">
          <WidgetTypography variant="title" class="mb-2 mt-16">
            Connect to Docusign
          </WidgetTypography>
        </div>
        <a
          :href="linkUrl"
          target="_blank"
          class="bg-brand px-6 py-5 rounded text-white pt-5"
          ><i class="pi pi-plus pr-3"></i>Connect to Docusign</a
        >
      </div>
    </div>
  </div>

  <DocusignConfirmDeleteDialog
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
