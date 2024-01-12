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

  console.debug(`timeUpdateListener currentTime=${currentTime.value}`);
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

const timerLeft = "0:10";
const timerSeek = "0:20";
</script>
<template>
  <div
    class="fixed bottom-0 bg-white container mx-auto px-2 pl-1 pt-2 border border-green-700"
  >
    <div class="flex items-center">
      <span
        class="mx-2 text-2xl sm:block cursor-pointer"
        title="Prev"
        @click="prevClick()"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 19l-7-7 7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
          />
        </svg>
      </span>

      <div
        class="text-yellow-400 border border-gray-300 border-dotted rounded-lg mx-1 flex items-center justify-center"
      >
        <div
          v-if="pause"
          class="p-1 flex items-center cursor-pointer"
          @click="unsetPause()"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 3l14 9-14 9V3z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="{2}"
            />
          </svg>
        </div>
        <div
          v-else
          class="p-1 flex items-center cursor-pointer"
          @click="setPause()"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 4h4v16H6zM14 4h4v16h-4z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="{2}"
            />
          </svg>
        </div>
      </div>
      <span
        class="mx-2 text-2xl sm:block cursor-pointer"
        title="Next"
        @click="nextClick()"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 5l7 7-7 7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
          />
        </svg>
      </span>

      <div class="flex-grow mr-3">
        <div class="truncate text-base leading-5 font-bold">
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
