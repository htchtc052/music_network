<script lang="ts" setup>
import { useAuthStore, useClientApi, useFetchInstance } from "#imports";

import type { ComputedRef } from "vue";
import type { Page } from "~/types/types";
import { storeToRefs } from "pinia";

const localPath = useLocalePath();
definePageMeta({ middleware: ["auth"] });
const auth = useAuthStore();
const { user } = storeToRefs(auth);
</script>
<template>
  <div class="flex flex-col items-center w-full">
    <h1 class="text-2xl font-semibold mb-4">Account {{ user.username }}</h1>
  </div>
</template>

<style scoped></style>
