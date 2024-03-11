<script lang="ts" setup>
import type { Track, User } from "~/types/types";

const props = defineProps<{
  tracks: Track[];
  userProfile: User;
}>();

const handleEdit = (userId: number) => {
  console.debug("edit", userId);
};

const playerStore = usePlayerStore();

const deleteTrack = (trackId: number) => {};

const editTrack = (trackId: number) => {};

const playTrack = (trackId: number) => {
  const position = props.tracks.findIndex((track) => track.id === trackId);
  console.debug("playTrack id", trackId, "position=", position);
  playerStore.playTrack(props.tracks, position);
};
</script>
<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
        User tracks
      </h3>
    </template>

    <div class="flex text-gray-600">
      <div class="p-2 w-8 flex-shrink-0"></div>
      <div class="p-2 w-full">Title</div>
      <div class="p-2 w-12 flex-shrink-0">⏱</div>
      <div class="p-2 w-12 flex-shrink-0"></div>
    </div>

    <div
      v-for="(track, index) in tracks"
      :key="track.id"
      class="flex border-b border-gray-300 hover:bg-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
    >
      <div class="p-3 w-8 flex-shrink-0">▶️</div>
      <div class="p-3 w-full">{{ track.title }}</div>
      <div class="p-3 w-12 flex-shrink-0">5:35</div>
      <div class="p-3 w-12 flex-shrink-0">edit delete</div>
    </div>

    <!--    <div
      v-for="(track, index) in tracks"
      :key="track.id"
      class="flex items-center justify-between"
    >
      <span>{{ track.trackFile.filePath }}</span>
      <UserTracksItem
        :is-owner="true"
        :track="track"
        :userProfile="userProfile"
        @deleteTrack="deleteTrack"
        @playTrack="playTrack"
      ></UserTracksItem>
    </div>-->
  </UCard>
</template>

<style scoped></style>
