<script setup lang="ts">
import { ref } from "vue";
import { onMounted, onBeforeUnmount } from "vue";
const video = ref(null);
const canvas = ref(null);
let videoStream = null;
let videoTrack: MediaStreamTrack | null = null;
let showCamera = ref(false);
let hideButton = ref(true);
onMounted(() => {});

onBeforeUnmount(() => {
  if (videoTrack) {
    videoTrack.stop();
  }
});
const takePhotoActive = () => {
  cameraSetup();
};
const cameraSetup = () => {
  showCamera.value = true;
  hideButton.value = false;
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.value.srcObject = stream;
      videoStream = stream;
      videoTrack = stream.getVideoTracks()[0];
    })
    .catch((error) => {
      console.log(error);
    });
};
const takePhoto = () => {
  const context = canvas.value.getContext("2d");
  console.log(video.value.videoWidth);
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;
  context.drawImage(video.value, 0, 0);
  const image = canvas.value.toDataURL("image/png");
};
</script>
<template>
  <div>
    <button
      v-show="hideButton"
      type="button"
      class="p-button"
      @click="takePhotoActive"
    >
      Take Photo Through Camera
    </button>
    <div v-show="showCamera">
      <video ref="video" autoplay></video>
      <button class="p-button" @click="takePhoto">Take Photo</button>
      <canvas class="mt-3" style="width: 300px" ref="canvas"></canvas>
    </div>
  </div>
</template>
<style>
.p-button {
  color: #212529;
  margin-top: 10px;
  background: #ffc107;
  border: 1px solid #ffc107;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s,
    box-shadow 0.2s;
  border-radius: 3px;
}
</style>
