<script lang="ts" setup>
import type { ComputedRef } from "vue";
import { useAuthStore } from "#imports";
import { storeToRefs } from "pinia";
import type { Page, Track } from "~/types/types";

const localPath = useLocalePath();

const api = useClientApi();

const route = useRoute();

const id: number = route.params.id as number;

const { data, pending, error } = await useAsyncData<{
  track: Track;
}>("track.detail", async () => {
  const track = await api.tracks.getTrack(id);
  return { track };
});

const track = ref<Track>([] as Track);

if (data.value) {
  track.value = data.value.track;
  track.value = data.value.track;
}

console.debug(`track id: ` + track.value.id, `error ` + error.value?.stack);

const handleEdit = (trackId: number) => {
  console.debug("edit", trackId);
};

const auth = useAuthStore();
const { user } = storeToRefs(auth);

const isOwner: ComputedRef<boolean> = computed(
  () => track.value.userId === user?.value?.id
);

console.debug(`isOwner`, isOwner.value);
</script>
<template>
  <div class="flex flex-col items-center w-full">
    <div v-if="error" class="text-red-500">Error loading page</div>
    <div v-else-if="pending" class="text-gray-500">Loading...</div>
    <div v-else>
      <div v-if="track" class="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-4">
          <h1 class="text-2xl font-semibold mb-4">Track: {{ track.title }}</h1>
          <div v-if="track.description" class="text-xl font-bold mb-2">
            {{ track.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
