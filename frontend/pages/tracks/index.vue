<script lang="ts" setup>
  import { useAuthStore } from "#imports";
  import TrackItem from "~/components/tracks/trackItem.vue";
  import { usePlayerStore } from "~/stores/usePlayerStore";
  import { type Track, type User } from "~/types/types";

  const localPath = useLocalePath();

  const api = useClientApi();

  const route = useRoute();

  const id: number = +route.params.id;

  const { data, pending, error } = await useAsyncData<{
    tracks: Track[];
  }>("tracks.catalog", async () => {
    const tracks = await api.tracks.getCatalogTracks();
    return { tracks };
  });

  const tracks = ref<Track[]>([] as Track[]);

  if (data.value) {
    tracks.value = data.value.tracks;
  }

  console.debug(`tracks length: ` + tracks.value.length, `error ` + error.value?.stack);

  const place = "catalogTracks";

  const playerStore = usePlayerStore();

  const playTrack = (trackId: number) => {
    const position = tracks.value.findIndex((track) => track.id === trackId);
    console.debug("playTrack id", trackId, "position=", position);
    playerStore.playTrack(tracks.value, position, place);
  };
</script>
<template>
  <div class="flex w-full flex-col items-center">
    <div v-if="error" class="text-red-500">Error loading page</div>
    <div v-else-if="pending" class="text-gray-500">Loading...</div>
    <div v-else>
      <div class="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div class="mb-4">
          <h1 class="mb-4 text-2xl font-semibold">Tracks catalog</h1>

          <div
            v-for="(track, index) in tracks"
            :key="track.id"
            class="flex items-center justify-between"
          >
            <track-item
              :is-owner="false"
              :place="place"
              :track="track"
              @playTrack="playTrack"
            ></track-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
