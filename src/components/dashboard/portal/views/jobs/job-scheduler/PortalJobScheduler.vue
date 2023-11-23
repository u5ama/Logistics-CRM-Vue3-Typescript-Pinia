<script setup lang="ts">
import WidgetTypography from "@dashboard-widgets/WidgetTypography.vue";
import { useLoading } from "@hooks";
import PortalWidget from "@dashboard-widgets/PortalWidget.vue";
import { onMounted } from "vue";
import SimpleLoader from "@components/UI/SimpleLoader.vue";
import CalendarDrag from "@dashboard-views/jobs/job-scheduler/Calendar-drag.vue";

onMounted(() => {
  fetchData();
});
const fetchData = async () => {
  setLoading.start();
  setLoading.stop();
};

const [isLoading, setLoading] = useLoading();

</script>

<template>
  <section class="widgets">
    <PortalWidget class="widget">
      <div class="flex justify-between items-center mb-7">
        <div class="">
          <WidgetTypography variant="title" class="mb-1">
            Job Scheduler
          </WidgetTypography>
        </div>
        <div class="flex gap-x-2">

        </div>
      </div>

      <SimpleLoader class="mt-20" v-if="isLoading" />

      <div class="" v-else>
        <div class="flex mb-3 justify-end">
          <CalendarDrag/>
        </div>
      </div>
    </PortalWidget>
  </section>
</template>

<style lang="scss" scoped>
.widget {
  min-height: 500px;
}
.widgets {
  @apply grid gap-8;
  .invoices {
    min-height: 400px;
  }
}
</style>
<style scoped>
@media only screen and (max-width: 600px) {
  .searchSize {
    width: 100% !important;
  }
}
</style>
