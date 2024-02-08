<script lang="ts" setup>
  import { useAuthStore } from "#imports";
  import { storeToRefs } from "pinia";
  import type { Page, Track } from "~/types/types";
  import type { ComputedRef } from "vue";

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

  const isOwner: ComputedRef<boolean> = computed(() => track.value.userId === user?.value?.id);
</script>
<template>
  <div class="flex w-full flex-col items-center">
    <div v-if="error" class="text-red-500">Error loading page</div>
    <div v-else-if="pending" class="text-gray-500">Loading...</div>
    <div v-else>
      <div v-if="track" class="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div class="mb-4">
          <h1 class="mb-4 text-2xl font-semibold">Track: {{ track.title }}</h1>
          <div v-if="track.description" class="mb-2 text-xl font-bold">
            {{ track.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
