<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import Button from "primevue/button";
import { storeToRefs } from "pinia";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import { useLoading, useModal } from "@hooks";
import { useSupplierContactsStore } from "@stores/suppliers/contacts";
import { FilterMatchMode } from "primevue/api";
import type { ISupplierContact } from "@/types/supplier";
import PortalWidget from "@dashboard/widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard/widgets/WidgetTypography.vue";
import ContactFormModal from "@dashboard-views/suppliers/edit-supplier/tabs/supplier-contacts/AddContactModal.vue";
import SupplierContactConfirmDeleteDialog from "@dashboard-views/suppliers/edit-supplier/tabs/supplier-contacts/SupplierContactConfirmDeleteDialog.vue";
import ContactsTable from "@dashboard-views/suppliers/edit-supplier/tabs/supplier-contacts/ContactsTable.vue";
import { editSupplierInjectionKey } from "@utils/injectionKeys";
import InputText from "primevue/inputtext";

const contactStore = useSupplierContactsStore();
const { contacts } = storeToRefs(contactStore);
const { getAllContacts } = contactStore;
const { supplierId } = inject(editSupplierInjectionKey)!;

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  setLoading.start();
  await getAllContacts(supplierId);
  setLoading.stop();
};

const [isLoading, setLoading] = useLoading();

const [isDeleteModalOpen, deleteDialog] = useModal();
const [isFormModalOpen, formModal] = useModal();

const selectedItem = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const openAddNewModal = () => {
  selectedItem.value = {};
  formModal.open();
};

const openEditModal = (item: ISupplierContact) => {
  selectedItem.value = { ...item };
  formModal.open();
};

const openConfirmDeleteDialog = (item: ISupplierContact) => {
  selectedItem.value = { ...item };
  deleteDialog.open();
};
</script>

<template>
  <PortalWidget class="widget">
    <div class="flex justify-between items-center mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          Supplier Contacts Information
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          @click="openAddNewModal"
          v-tooltip.left="'Add Contacts'"
        />
        <Button
          icon="pi pi-replay"
          class="p-button-rounded p-button-secondary -rotate-45"
          @click="fetchData"
          v-tooltip.top="'Reload Data'"
          :loading="isLoading"
        />
      </div>
    </div>

    <SimpleLoader class="mt-20" v-if="isLoading" />

    <div class="" v-else>
      <div class="flex mb-3 justify-end">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Search Contact"
          />
        </span>
      </div>
      <ContactsTable
        :filters="filters"
        :contacts="contacts"
        @edit="openEditModal"
        @delete="openConfirmDeleteDialog"
      />
    </div>
  </PortalWidget>

  <ContactFormModal
    :isOpen="isFormModalOpen"
    :selectedItem="selectedItem"
    @close="formModal.close"
  />
  <SupplierContactConfirmDeleteDialog
    :isOpen="isDeleteModalOpen"
    :selectedItem="selectedItem"
    @close="deleteDialog.close"
  />
</template>

<style lang="scss" scoped>
.wrapper :deep(*) {
  .p-panel-content {
    height: 500px;
    overflow-y: scroll;
  }
}
</style>
