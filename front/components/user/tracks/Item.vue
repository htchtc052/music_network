<script lang="ts" setup>
import type { Track } from "~/types/types";
import type { ComputedRef } from "vue";

const props = defineProps<{ track: Track; isOwner: boolean }>();

const emits = defineEmits<{
  editTrack: [id: number];
  deleteTrack: [id: number];
  playTrack: [id: number];
}>();

const playerStore = usePlayerStore();

const isPlaying: ComputedRef<boolean> = computed(() => {
  return props.track.id === playerStore.track?.id && !playerStore.pause;
});

const playTrack = () => {
  emits("playTrack", props.track.id);
};

const deleteTrack = () => {
  emits("deleteTrack", props.track.id);
};

const editTrack = () => {
  emits("editTrack", props.track.id);
};
</script>

<template>
  <div>
    <div class="flex-shrink-0">
      <a
        class="btn btn-outline-warning flex items-center justify-center rounded-full"
        href="#"
        @click.prevent="playTrack()"
      >
        <div class="flex items-center px-1 py-2">
          <icon
            v-if="isPlaying"
            class="text-blue-900"
            name="material-symbols:pause-circle"
            size="48"
          ></icon>
          <icon
            v-else
            class="text-blue-900"
            name="material-symbols:play-circle"
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

    <div v-if="isOwner" class="mt-4">
      <button
        class="mr-2 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
        @click="deleteTrack()"
      >
        Delete
      </button>
      <button
        class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        @click="editTrack()"
      >
        Edit
      </button>
    </div>
  </div>
</template>
