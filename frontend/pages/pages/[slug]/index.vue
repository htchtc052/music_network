<script lang="ts" setup>
import type { ComputedRef } from "vue";
import { useAuthStore } from "#imports";
import { storeToRefs } from "pinia";
import type { Page, Track } from "~/types/types";
import { usePlayerStore } from "~/stores/usePlayerStore";

const localPath = useLocalePath();

const api = useClientApi();

const route = useRoute();

const slug: string = route.params.slug as string;

const { data, pending, error } = await useAsyncData<{
  page: Page;
  tracks: Track[];
}>("page.detail", async () => {
  const page = await api.pages.getPage(slug);
  const tracks = await api.pages.getPageTracks(slug);
  return { page, tracks };
});

const page = ref<Page>({} as Page);

const tracks = ref<Track[]>([] as Track[]);

if (data.value) {
  page.value = data.value.page;
  tracks.value = data.value.tracks;
}

// console.debug(
//   `page: ` + page.value.title,
//   `tracks length: ` + tracks.value.length,
//   `error ` + error.value?.stack
// );

const handleEdit = (pageId: number) => {
  console.debug("edit", pageId);
};
const auth = useAuthStore();
const { user } = storeToRefs(auth);

const isOwner: ComputedRef<boolean> = computed(
  () => page.value.userId === user?.value?.id
);

console.debug(`isOwner`, isOwner.value);

const player = usePlayerStore();

const playTrack = (trackId: number) => {
  console.debug("playTrack", trackId, tracks.value);

  player.playTrack(tracks.value, trackId, "pageTracks");

  // const position = tracks.value.findIndex(
  //   (track: Track) => track.id == trackId
  // );
};

const isPlaying = (trackId: number): boolean => {
  console.debug("isPlaying trackid", trackId);
  //return trackId === 0;

  return false;
};
</script>
<template>
  <div class="flex flex-col items-center w-full">
    <div v-if="error" class="text-red-500">Error loading page</div>
    <div v-else-if="pending" class="text-gray-500">Loading...</div>
    <div v-else>
      <div v-if="page" class="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-4">
          <nuxt-link
            :to="'/pages/' + page.slug + '/uploadTrack'"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mb-6"
            >Upload track</nuxt-link
          >
          <h1 class="text-2xl font-semibold mb-4">Page: {{ page.title }}</h1>
          <div v-if="page.description" class="text-xl font-bold mb-2">
            {{ page.description }}
          </div>
          <div>Tracks</div>

          <div
            v-for="(track, index) in tracks"
            :key="track.id"
            class="flex items-center justify-between"
          >
            <div class="flex-shrink-0">
              <a
                class="btn btn-outline-warning rounded-full flex items-center justify-center"
                href="#"
                @click.prevent="playTrack(index)"
              >
                <div class="px-1 py-2 flex items-center">
                  <icon
                    v-if="isPlaying(index)"
                    class="text-blue-900"
                    name="material-symbols:play-circle"
                    size="48"
                  ></icon>
                  <icon
                    v-else
                    class="text-blue-900"
                    name="material-symbols:pause-circle"
                    size="48"
                  ></icon>
                </div>
              </a>
            </div>
            <div class="flex-grow px-4">
              <nuxt-link :to="'/tracks/' + track.id" class="px-4 py-2">
                {{ track.title }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
