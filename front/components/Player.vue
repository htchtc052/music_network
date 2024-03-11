<script lang="ts" setup>
import { usePlayerStore } from "#imports";
import type { ComputedRef } from "vue";

const playerStore = usePlayerStore();

const { track, pause, isLast } = storeToRefs(playerStore);

const audioPlayer = ref<HTMLAudioElement>();

const duration = ref<number>(0);

const currentTime = ref<number>(0);

const volume = ref<number>(1);

const readableDuration: ComputedRef<string | null> = computed(() => {
  return duration.value ? formatTime(Math.floor(duration.value)) : null;
});

const readableCurrentTime: ComputedRef<string | null> = computed(() => {
  return currentTime.value ? formatTime(Math.floor(currentTime.value)) : null;
});

//TODO перенести расчет пути на бекенд
const filePath: ComputedRef<string | null> = computed(() => {
  const newFilePath =
    track.value != null
      ? "http://localhost:4100" +
        track.value.trackFile?.filePath.replace("uploads", "")
      : null;
  return newFilePath;
});

const progressBar = ref<HTMLElement | null>(null);

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60) || 0;
  const seconds = timeInSeconds - minutes * 60 || 0;

  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

const timeUpdateListener = () => {
  currentTime.value = audioPlayer.value?.currentTime || 0;

  ///const progressPercent = (currentTime / duration.value) * 100;
  progressBar.value.value = currentTime.value;
};

const updateTime = () => {
  (audioPlayer.value as HTMLAudioElement).currentTime =
    progressBar.value.value | 0;
};

const setVolume = () => {
  (audioPlayer.value as HTMLAudioElement).volume = volume.value.value;
};

const onEndPlayTrack = () => {
  playerStore.onEndPlayTrack();
};

const loadedMetadateListener = () => {
  duration.value = audioPlayer.value?.duration || 0;
};

watch(filePath, (newValue) => {
  console.debug(`watch`, filePath.value);

  if (audioPlayer.value) {
    audioPlayer.value.src = filePath.value || "";
    audioPlayer.value.play();

    duration.value = audioPlayer.value?.duration;

    console.debug(`dur`, audioPlayer.value);

    audioPlayer.value.addEventListener(
      "loadedmetadata",
      loadedMetadateListener
    );

    audioPlayer.value.addEventListener("timeupdate", timeUpdateListener);
    audioPlayer.value.addEventListener("ended", onEndPlayTrack);
  }
});

watch(pause, (newValue) => {
  if (!newValue) {
    audioPlayer.value?.play();
  } else {
    audioPlayer.value?.pause();
  }
});

const prevClick = () => {
  playerStore.prevClick();
};

const nextClick = () => {
  playerStore.nextClick();
};

const setPause = () => {
  console.log("setPause");
  audioPlayer.value?.pause();
};

const unsetPause = () => {
  console.log("unsetPause");
  audioPlayer.value?.pause();
};
</script>
<template>
  <div class="player_container">
    <div v-if="track" class="flex items-center">
      <span class="prev_btn" title="Prev" @click="prevClick()">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 19l-7-7 7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2px"
          />
        </svg>
      </span>

      <div v-if="pause" class="pause_btn" @click="unsetPause()">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 3l14 9-14 9V3z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2px"
          />
        </svg>
      </div>
      <div v-else class="pause_btn" @click="setPause()">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4h4v16H6zM14 4h4v16h-4z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2px"
          />
        </svg>
      </div>
      <span class="next_btn" title="Next" @click="nextClick()">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 5l7 7-7 7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2px"
          />
        </svg>
      </span>

      <div class="mr-3 flex-grow">
        <div class="truncate text-base font-bold leading-5">
          !! {{ track?.title }}!!
        </div>
      </div>

      <audio ref="audioPlayer" preload="metadata"></audio>

      <input
        ref="progressBar"
        :max="duration"
        class="w-full"
        min="0"
        step="0.1"
        type="range"
        @input="updateTime"
      />

      <span>{{ readableCurrentTime }}</span> -
      <span>{{ readableDuration }}</span>

      <input
        ref="volume"
        max="1"
        min="0"
        step="0.01"
        type="range"
        @input="setVolume"
      />
    </div>
  </div>
</template>
<style></style>
