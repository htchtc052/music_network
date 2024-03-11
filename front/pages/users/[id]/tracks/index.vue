<script lang="ts" setup>
import type { Track } from "~/types/types";

const userProfile = await useGetUserProfile();

const route = useRoute();

const id: number = +route.params.id;

const api = useClientApi();

const {
  data: tracksData,
  error: tracksError,
  pending,
} = await useAsyncData<{
  tracks: Track[];
}>("user.tracks", async () => {
  const tracks = await api.userProfile.getUserTracks(id);
  return { tracks };
});

const tracks = ref<Track[]>([] as Track[]);

if (tracksData.value) {
  tracks.value = tracksData.value?.tracks;
}

const columns = [
  {
    key: "id",
    label: "#",
    sortable: true,
  },
  {
    key: "title",
    label: "Title",
    sortable: true,
  },
  {
    key: "completed",
    label: "Status",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
  },
];
</script>
<template>
  <UContainer class="py-4">
    <UserMenu :userProfile="userProfile" />
  </UContainer>
  <UContainer>
    <!--    <UCard>
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
          User tracks
        </h3>
      </template>

      <div class="flex">
        <div class="p-2 w-8 flex-shrink-0"></div>
        <div class="p-2 w-full text-gray-800 dark-text-gray-200">Title</div>
        <div class="p-2 w-12 flex-shrink-0 text-gray-700">
          <UIcon name="i-heroicons-clock" />
        </div>
        <div class="p-2 w-14 flex-shrink-0"></div>
      </div>

      <div
        v-for="(track, index) in tracks"
        :key="track.id"
        class="flex border-b border-gray-300 hover:bg-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
      >
        <div class="p-4 w-8 flex-shrink-0">
          <UIcon name="i-heroicons-play-solid" />
        </div>
        <div class="p-4 w-full">{{ track.title }}</div>
        <div class="p-4 w-12 flex-shrink-0">5:35</div>
        <div class="p-4 w-16 flex-shrink-0 text-right">
          <UIcon name="i-heroicons-pencil-square" />
          <UIcon name="i-heroicons-trash" />
        </div>
      </div>
    </UCard>-->
  </UContainer>
</template>

<style scoped></style>
