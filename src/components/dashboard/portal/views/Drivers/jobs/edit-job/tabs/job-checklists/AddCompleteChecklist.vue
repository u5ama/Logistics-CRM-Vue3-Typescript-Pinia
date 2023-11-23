<script setup lang="ts">
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import Button from "primevue/button";
import { useForm } from "vee-validate";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useLoading } from "@hooks";
import { useJobDriversStore } from "@stores/jobs/drivers";
import { storeToRefs } from "pinia";
import InvoiceFormDropdown from "@dashboard-views/invoicing/InvoiceFormDropdown.vue";
import AssetFormDropdown from "@dashboard-views/Drivers/jobs/edit-job/tabs/job-checklists/AssetFormDropdown.vue";
import { useResourceAssetsStore } from "@stores/resources/assets";
import router, { DashboardRouteNames } from "@router";

interface Props {
  open: boolean;
}
const emit = defineEmits(["close", "success"]);
defineProps<Props>();

const jobId = parseInt(useRoute().params.id as string);
const isEditing = !!jobId;

const [isJobLoading, setJobLoading] = useLoading(isEditing);

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validateOnMount: false,
});

const resourceAssetsStore = useResourceAssetsStore();
const { asset } = storeToRefs(resourceAssetsStore);
const { getAsset } = resourceAssetsStore;

const jobDriversStore = useJobDriversStore();
const { jobAssets } = storeToRefs(jobDriversStore);
const { getAllJobAssets } = jobDriversStore;

onMounted(async () => {
  setJobLoading.start();
  await getAllJobAssets(jobId);
  setJobLoading.stop();
});

const submitHandler = handleSubmit(async (values) => {
  const { asset_id, checklist_id } = values;
  router.push({
    name: DashboardRouteNames.completeChecklists,
    params: { id: checklist_id, asset: asset_id },
  });
});

const refreshHandler = async (selectedAssetId: any) => {
  console.log('Selected Asset ID:', selectedAssetId);
  await getAsset(selectedAssetId);
};
const resetFormHandler = () => {
  resetForm();
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-mask">
        <div
          class="modal-container relative bg-white w-full max-w-xl py-12 px-16 rounded"
          @click.stop
        >
          <div class="absolute top-3 right-4">
            <i class="pi pi-times cursor-pointer" @click="$emit('close')"></i>
          </div>

          <StyledHeading class="mb-12"> Select Checklist </StyledHeading>
          <div class="card justify-content-center">
            <div class="flex flex-col gap-5 mb-12">
              <AssetFormDropdown
                class="col-span-6"
                label="Choose Asset"
                name="asset_id"
                :options="jobAssets"
                @change="refreshHandler"
                :loading="isJobLoading"
              />

              <InvoiceFormDropdown
                class="col-span-6"
                label="Choose Checklist"
                name="checklist_id"
                :options="asset?.checklists"
                :loading="isJobLoading"
              />
            </div>
          </div>
          <div class="flex lg:justify-end">
            <Button
              :loading="isSubmitting"
              label="View Checklist"
              type="submit"
              class="p-button p-button-primary w-full"
              @click="submitHandler"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  //z-index: 9998;
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