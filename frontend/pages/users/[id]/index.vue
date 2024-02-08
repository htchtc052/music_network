<script lang="ts" setup>
  import { useAuthStore } from "#imports";
  import TrackItem from "~/components/tracks/trackItem.vue";
  import TrackList from "~/components/tracks/trackList.vue";
  import { usePlayerStore } from "~/stores/usePlayerStore";
  import { Genders } from "~/types/types";
  import { storeToRefs } from "pinia";
  import type { Track, User } from "~/types/types";
  import type { ComputedRef } from "vue";

  const localPath = useLocalePath();

  const api = useClientApi();

  const route = useRoute();

  const id: number = +route.params.id;

  const { data, pending, error } = await useAsyncData<{
    userProfile: User;
    tracks: Track[];
  }>("user.detail", async () => {
    const userProfile: User = await api.userProfile.getUserProfile(id);
    const tracks = await api.userProfile.getUserTracks(id);
    return { userProfile, tracks };
  });

  const userProfile = ref<User>({} as User);

  const tracks = ref<Track[]>([] as Track[]);

  if (data.value) {
    userProfile.value = data.value.userProfile;
    tracks.value = data.value.tracks;
  }

  console.debug(
    `userProfile: ` + userProfile.value.email,
    `tracks length: ` + tracks.value.length,
    `error ` + error.value?.stack
  );

  const handleEdit = (userId: number) => {
    console.debug("edit", userId);
  };
  const auth = useAuthStore();
  const { user } = storeToRefs(auth);

  const isOwner: ComputedRef<boolean> = computed(() => userProfile.value.id === user?.value?.id);

  console.debug(`isOwner`, isOwner.value);
  const place = "userTracks";

  const playerStore = usePlayerStore();

  const deleteTrack = (trackId: number) => {};

  const editTrack = (trackId: number) => {};

  const playTrack = (trackId: number) => {
    const position = tracks.value.findIndex((track) => track.id === trackId);
    console.debug("playTrack id", trackId, "position=", position);
    playerStore.playTrack(tracks.value, position, place);
  };
</script>
<template>
  <div class="content">
    <div class="user_profile">
      <h1 class="user_profile_item">
        {{ userProfile.username }}
      </h1>
      <div class="user_profile_item">
        <div v-if="userProfile.firstName && userProfile.lastName" class="info_record">
          <strong>Real name:</strong> {{ userProfile.firstName }}
          {{ userProfile.lastName }}
        </div>

        <div v-if="userProfile.gender" class="info_record">
          <strong>Gender:</strong>
          <span v-if="userProfile.gender === Genders.MALE">Male</span>
          <span v-else-if="userProfile.gender === Genders.FEMALE">Female</span>
          <span v-else>Not Specified</span>
        </div>
      </div>
      <div class="user_profile_item">
        <div class="tracks_top">
          <h3>User tracks</h3>
          <nuxt-link :to="'/tracks/uploadTrack'" class="track_upload_btn">Upload track</nuxt-link>
        </div>

        <div v-if="error" class="tracks_block">Error loading page</div>
        <div v-else-if="pending" class="tracks_block">Loading...</div>
        <track-list
          v-else
          :is-owner="isOwner"
          :tracks="tracks"
          class="tracks_block"
          place="userTracks"
        ></track-list>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .user_profile {
    border: 1px solid red;
    margin-top: 20px;
    max-width: 600px;
  }

  h1.user_profile_item {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .user_profile_item {
    border: 1px green solid;
  }

  .user_profile_item > .info_record {
    margin-bottom: 10px;
  }

  .user_profile_tracks {
  }

  .tracks_top {
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-bottom: 10px;
    padding: 10px 15px;
  }

  .tracks_top > h3 {
    font-size: 24px;
  }

  .track_upload_btn {
    border: none;
    border-radius: 10px;
    padding: 5px 10px;
    background-color: blue;
    color: white;
    text-decoration: none;
    margin-left: auto;
    font-size: 16px;
  }

  .tracks_block {
    border: 1px solid black;
  }
</style>
