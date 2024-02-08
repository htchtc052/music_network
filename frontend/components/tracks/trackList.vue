<script lang="ts" setup>
  import TrackItem from "~/components/tracks/trackItem.vue";
  import { usePlayerStore } from "~/stores/usePlayerStore";
  import type { Track } from "~/types/types";

  const props = defineProps<{
    tracks: Track[];
    place: string;
    isOwner: boolean;
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
    playerStore.playTrack(props.tracks, position, props.place);
  };
</script>
<template>
  <div class="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
    <div v-for="(track, index) in tracks" :key="track.id" class="flex items-center justify-between">
      <span>{{ track.file.filePath}}}</span>
      <track-item
        :is-owner="isOwner"
        :place="place"
        :track="track"
        @deleteTrack="deleteTrack"
        @playTrack="playTrack"
      ></track-item>
    </div>
  </div>
</template>
