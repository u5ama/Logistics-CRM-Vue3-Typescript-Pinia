<script setup lang="ts">
import { onMounted, ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Dialog from "primevue/dialog";
import { useJobsStore } from "@stores/jobs/jobs";
import { storeToRefs } from "pinia";
import { DashboardRouteNames } from "@router";

let showDialog = ref(false);
const selectedEvent = ref(null);

const jobsStore = useJobsStore();
const { jobCalendar } = storeToRefs(jobsStore);
const { getCustomAllJobs } = jobsStore;
const { changeJobDate } = jobsStore;

const handleEventClick = (info: any) => {
  selectedEvent.value = info.event;
  showDialog.value = true;
};

const handleEventDrop = (info: any) => {
  const { event } = info;
  const updatedEvent = events.value.find((e: any) => e.id === event.id);
  if (updatedEvent) {

    if (event.start){
      updatedEvent.start = event.start.toISOString(); // Update start date
    }
    if (event.start){
      updatedEvent.end = event.end.toISOString(); // Update end date
    }

    changeJobDate(
      updatedEvent.id,
      updatedEvent.start,
      updatedEvent.end,
    );
  }
};

const events = ref<any[]>([]);
const calendarOptions = ref<any>({
  plugins: [dayGridPlugin, interactionPlugin],
  eventColor: "#008000",
  eventTextColor: '#FFFFFF',
  initialView: 'dayGridDay',
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'dayGridDay,dayGridWeek,dayGridMonth' // user can switch between the two
  },
  nowIndicator: false,
  height: 'auto',
  events: events.value,
  editable: true, // Enable event dragging
  eventOverlap: true, // Adjust this as needed
  selectable: true, // Enable selecting events
  selectMirror: true, // Enable mirroring when selecting
  select: handleEventSelect, // Handle event selection
  eventClick: handleEventClick,
  eventDrop: handleEventDrop,
  eventResize: handleEventDrop,
});

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  await getCustomAllJobs();
  if (jobCalendar.value){
    events.value = jobCalendar.value.map(job => ({
      id: String(job.id),
      title: job.title,
      start: job.start,
      end: job.end,
      client_name: job.client_name,
      job_address: job.job_address,
      allDay: true,
      assets: job.assets || []
    }));

    // Update the calendarOptions events value
    calendarOptions.value.events = events.value;
  }
};

function handleEventSelect(info: any) {
  console.log('Selected:', info);
}

function formattedDate(date: string | number | Date) {
  if (!date) return '';
  return new Date(date).toISOString().slice(0, 10); // Adjust the formatting as needed
}
</script>

<template>
  <div>
    <FullCalendar
      ref="calendar"
      :options="calendarOptions"
      @eventDrop="handleEventDrop"
    />
    <Dialog v-model:visible="showDialog" modal :header="selectedEvent?.title" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }">
      <p>
        <p>
          <strong>Job Description: </strong>{{selectedEvent?.extendedProps.content}}
        </p>
        <p>
          <strong>Address: </strong>{{selectedEvent?.extendedProps.job_address}}
        </p>
        <p>
          <strong> Client: </strong>{{selectedEvent?.extendedProps.client_name}}
        </p>
        <p v-if="selectedEvent?.extendedProps.assets.length>0"><strong> Assets: </strong>
          <ul v-for="asset in selectedEvent?.extendedProps.assets">
            <li>
              - {{asset.name}}
            </li>
          </ul>
        </p>
        <strong>Job details:</strong>
        <ul>
          <li>- Job starts at: {{ formattedDate(selectedEvent?.start) }}</li>
          <li>- Job ends at: {{ formattedDate(selectedEvent?.end) }}</li>
        </ul>
        <p class="link-colors"><br><RouterLink
          :to="{
            name: DashboardRouteNames.editJob,
            params: { id: selectedEvent?.id },
          }"
        >
          View More Job Details
        </RouterLink></p>
      </p>
    </Dialog>
  </div>
</template>

<style scoped>
/* Add your calendar styling here */
.link-colors{
  color: cornflowerblue;
  text-decoration: underline;
}
</style>
