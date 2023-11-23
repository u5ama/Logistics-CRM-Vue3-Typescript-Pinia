<script setup lang="ts">
import { computed, inject, onMounted } from "vue";
import Panel from "primevue/panel";
import Button from "primevue/button";
import { storeToRefs } from "pinia";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import AddContactModal from "./AddContactsModal.vue";
import { useClientContactsStore } from "@stores/clients/contacts";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useToast } from "vue-toastification";
import { editClientInjectionKey } from "@utils/injectionKeys";
import { useLoading, useModal } from "@hooks";

const contactsStore = useClientContactsStore();
const { contacts } = storeToRefs(contactsStore);
const { getAllContacts, deleteContact } = contactsStore;
const [isLoading, setLoading] = useLoading();
const [isModalOpen, setModal] = useModal();
const { clientId } = inject(editClientInjectionKey)!;

const fetchContacts = async () => {
  setLoading.start();
  await getAllContacts(clientId);
  setLoading.stop();
};

onMounted(async () => {
  if (!contacts.value.length) await fetchContacts();
});

const documentRows = computed(() =>
  contacts.value.map((doc) => ({
    id: doc.id,
    first_name: doc.first_name,
    last_name: doc.last_name,
    phone: doc.phone,
    address: doc.address,
    title: doc.title,
    email: doc.email,
    date: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(doc.created_at)),
  }))
);

const [isDeleting, setDeleting] = useLoading();

const deleteDocHandler = async (docId: number) => {
  setDeleting.start();
  await deleteContact(docId);

  useToast().success("Contact deleted Successfully!");
  setDeleting.stop();
};
</script>

<template>
  <div class="wrapper max-w-6xl mt-6 mx-auto">
    <AddContactModal
      v-if="isModalOpen"
      :open="isModalOpen"
      @close="setModal.close"
    />
    <Panel>
      <template #header>
        <StyledHeading level="h3">Client Contacts</StyledHeading>
      </template>
      <template #icons>
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          v-tooltip.top="'Upload Contact'"
          @click="setModal.open"
        />
        <Button
          icon="pi pi-replay"
          class="p-button-rounded p-button-secondary -rotate-45"
          @click="fetchContacts"
          v-tooltip.top="'Reload Data'"
        />
      </template>

      <SimpleLoader v-if="isLoading" />

      <div class="flex flex-col gap-y-6" v-else-if="contacts.length">
        <DataTable :value="documentRows" stripedRows responsiveLayout="scroll">
          <Column field="first_name" header="First Name"></Column>
          <Column field="last_name" header="Last Name"></Column>
          <Column field="email" header="Email"></Column>
          <Column field="phone" header="Phone"></Column>
          <Column field="address" header="Address"></Column>
          <Column field="title" header="Title/Position"></Column>
          <Column field="date" header="Created Date"></Column>
          <Column header="Actions">
            <template #body="{ data }">
              <Button
                :disabled="isDeleting"
                icon="pi pi-trash"
                class="p-button-danger p-button-rounded p-button-text"
                v-tooltip.right="'Delete Contact'"
                @click="deleteDocHandler(data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
      <p class="text-center mt-4" v-else>No Records Found</p>
    </Panel>
  </div>
</template>

<style lang="scss" scoped>
.wrapper :deep(*) {
  .p-panel-content {
    height: 500px;
    overflow-y: scroll;
  }

  .p-tag {
    @apply bg-slate-200 px-4;
  }

  .tag {
    @apply bg-slate-200 rounded-full px-2 py-1 font-semibold;
  }
}
</style>
