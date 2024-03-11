<script lang="ts" setup>
import type { User } from "~/types/types";
import { Genders } from "~/types/types";

const props = defineProps<{ userProfile: User }>();

const gender: ComputedRef<string> = computed(() => {
  let gender = "Not specified";
  if (props.userProfile.gender === Genders.MALE) {
    gender = "Male";
  } else if (props.userProfile.gender === Genders.FEMALE) {
    gender = "Male";
  }
  return gender;
});
</script>

<template></template>

<style scoped></style>
