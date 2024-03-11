<script lang="ts" setup>
import type { User } from "~/types/types";

const props = defineProps<{ userProfile: User }>();

console.debug("rrr", props.userProfile);

const links = [
  {
    label: "Info",
    icon: "i-heroicons-identification",
    to: "/users/" + props.userProfile.id,
  },
  {
    label: "Tracks",
    icon: "i-heroicons-musical-note",
    to: "/users/" + props.userProfile.id + "/tracks",
  },
];
</script>

<template>
  <div class="flex w-full justify-between">
    <span class="justify-left inline-flex gap-x-1 items-center">
      <UAvatar
        :alt="userProfile?.username"
        size="lg"
        src="https://avatars.githubusercontent.com/u/739984?v=4"
      />
      <span>{{ userProfile.username }}</span>
    </span>

    <UHorizontalNavigation :links="links" class="justify-end" />
  </div>
</template>

<style scoped></style>
