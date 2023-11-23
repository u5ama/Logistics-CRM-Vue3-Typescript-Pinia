<script setup>
import { defineProps, onMounted, ref } from "vue";
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import Dialog from 'primevue/dialog';
import { useLoading } from "@hooks";

const { jobs } = defineProps(['jobs']);

const events = ref([]);
onMounted(() => {
  fetchData();
});
const fetchData = async () => {
  setLoading.start();
  events.value = jobs;
  setLoading.stop();
};
const [isLoading, setLoading] = useLoading();

let selectedEvent = ref({});
let showDialog = ref(false);
const onEventClick = (event, e) => {
  selectedEvent.value = event
  showDialog.value = true
  e.stopPropagation()
}
</script>

<template>
  <vue-cal
    class="vuecal--blue-theme"
    hide-weekends
    :events="events"
    :on-event-click="onEventClick"
  ></vue-cal>
  <Dialog v-model:visible="showDialog" modal :header="selectedEvent?.title" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }">
    <p>
      <p><strong>Job Description: </strong>{{selectedEvent?.content}}</p>
      <p><strong>Address: </strong>{{selectedEvent?.job_address}}</p>
      <p><strong> Client: </strong>{{selectedEvent?.client_name}}</p>
      <p v-if="selectedEvent?.assets.length>0"><strong> Assets: </strong>
        <ul v-for="asset in selectedEvent?.assets">
          <li>
            - {{asset.name}}
          </li>
        </ul>
      </p>
      <strong>Job details:</strong>
      <ul>
        <li>- Job starts at: {{ selectedEvent?.start && selectedEvent?.start?.format('DD/MM/YYYY') }}</li>
        <li>- Job ends at: {{ selectedEvent?.end && selectedEvent?.end?.format('DD/MM/YYYY') }}</li>
      </ul>
    </p>
  </Dialog>
</template>

<style scoped>
.vuecal {height: 90vh;}
.vuecal__event {cursor: pointer;}
.vuecal__event-title {
  font-size: 1.2em;
  font-weight: bold;
  margin: 4px 0 8px;
}
.vuecal__event-time {
  display: inline-block;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.vuecal__event-content {
  font-style: italic;
}
</style>