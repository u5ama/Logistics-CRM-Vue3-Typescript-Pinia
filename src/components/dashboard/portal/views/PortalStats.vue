<script setup lang="ts">
import StyledHeading from "@components/UI/typography/StyledHeading.vue";
import StatsHighlights from "@dashboard-widgets/stats/StatsHighlights.vue";
import SoilMoved from "@dashboard-widgets/stats/SoilMoved.vue";
import ProjectsCompleted from "@dashboard-widgets/stats/ProjectsCompleted.vue";
import MachineryStatus from "@dashboard-widgets/stats/MachineryStatus.vue";
</script>

<template>
  <StyledHeading class="mb-8">Starbuck Statistics</StyledHeading>
  <section class="widgets">
    <StatsHighlights class="highlights" />
    <SoilMoved class="soil" />
    <ProjectsCompleted class="projects" />
    <MachineryStatus class="machinery" />
  </section>
</template>

<style lang="scss" scoped>
.widgets {
  @apply grid gap-8;
  grid-template-columns: repeat(1, 1fr);

  @include respond(md) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, min-content);
    grid-template-areas:
      "highlights soil"
      "highlights projects"
      "machinery machinery";

    .highlights {
      grid-area: highlights;
    }
    .soil {
      grid-area: soil;
    }
    .projects {
      grid-area: projects;
    }
    .machinery {
      grid-area: machinery;
    }
    .stats {
      grid-area: stats;
    }
  }
}
</style>
