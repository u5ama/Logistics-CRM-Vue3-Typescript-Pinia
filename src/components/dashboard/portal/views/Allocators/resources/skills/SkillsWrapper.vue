<script setup lang="ts">
import Chip from "primevue/chip";
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useLoading } from "@hooks";
import { useResourceSkillsStore } from "@stores/resources/skills";
import type { IResourceSkill } from "@app-types/resources";
import { useToast } from "vue-toastification";
interface Props {
  title: string;
  skills: IResourceSkill[];
}

const skillsStore = useResourceSkillsStore();
const { deleteSkill } = skillsStore;

defineProps<Props>();

const [isLoading, setLoading] = useLoading();
const skillRemoveHandler = async (id: number) => {
  setLoading.start();
  await deleteSkill(id);
  setLoading.stop();
  useToast().success("Skill deleted successfully");
};
</script>

<template>
  <div :class="{ 'loading-faded': isLoading }">
    <WidgetTypography variant="title" class="mb-2">
      {{ title }}
    </WidgetTypography>
    <p v-if="!skills.length" class="text-gray-600">No Skill added yet.</p>
    <div class="flex gap-x-2 gap-y-3 mx-2 skills mt-4" v-else>
      <Chip
        v-for="skill in skills"
        :key="skill.id"
        :label="skill.name"
        @remove="() => skillRemoveHandler(skill.id)"
        removable
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.skills) .p-chip {
  @apply font-semibold px-3;
  &-remove-icon {
    @apply ml-3;

    &:hover {
      @apply text-red-600;
    }
  }
}
</style>
