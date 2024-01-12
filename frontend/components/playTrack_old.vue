<template>
  <div>
    <a class="border text-decoration-none rounded-5 link d-flex align-items-center miniplayer-small justify-content-center" :href="`${track.downloadLink}`" :class="[track.hiddenBy ? 'text-muted border-dotted' : 'text-warning border-warning border-2']" @click.prevent="$player.playTrack(track._id, trackList, place)">
      <div class="px-1 py-2 d-flex align-items-center">
        <i class="fas fa-pause mx-1 t-20" v-if="$player.isPlaying(track._id, place)"></i>
        <i class="fas fa-play mx-1 t-20" :class="{ 'op-3': track.hiddenBy }" v-else></i>
      </div>
    </a>
  </div>
</template>
<script>
export default {
  props: ["track", "trackList", "place"],
  created() {},
};
</script>