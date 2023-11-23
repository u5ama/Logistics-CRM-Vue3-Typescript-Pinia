<script setup lang="ts">
import { onMounted } from "vue";
import Button from "primevue/button";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useLoading, useModal } from "@hooks";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import AddNewSkillsModal from "./AddNewSkillsModal.vue";
import { useResourceSkillsStore } from "@stores/resources/skills";
import SkillsWrapper from "./SkillsWrapper.vue";
import { storeToRefs } from "pinia";

const skillsStore = useResourceSkillsStore();
const { skills } = storeToRefs(skillsStore);
const { getAllSkills } = skillsStore;

onMounted(() => {
  fetchData();
});
const fetchData = async () => {
  setLoading.start();
  await getAllSkills();
  setLoading.stop();
};

const [isLoading, setLoading] = useLoading();
const [isAddModalOpen, addModal] = useModal();
</script>

<template>
  <PortalWidget class="widget">
    <div class="flex justify-between items-center mb-7">
      <div class="">
        <WidgetTypography variant="title" class="mb-1">
          Resources Skills
        </WidgetTypography>
      </div>
      <div class="flex gap-x-2">
        <Button
          icon="pi pi-plus"
          class="p-button-rounded p-button-success mr-1"
          @click="addModal.open"
          v-tooltip.left="'Add new Skill'"
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
    <div class="flex flex-col gap-y-8" v-else>
      <SkillsWrapper title="All Skills" :skills="skills" />
    </div>
  </PortalWidget>
  <AddNewSkillsModal :isOpen="isAddModalOpen" @close="addModal.close" />
</template>

<style lang="scss" scoped>
.widget {
  min-height: 500px;
}
</style>
