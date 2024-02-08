<script lang="ts" setup>
  import { useAuthStore, useClientApi, useFetchInstance } from "#imports";
  import { storeToRefs } from "pinia";
  import type { Page } from "~/types/types";
  import type { ComputedRef } from "vue";

  const localPath = useLocalePath();
  definePageMeta({ middleware: ["auth"] });
  const auth = useAuthStore();
  const { user } = storeToRefs(auth);
</script>
<template>
  <div class="flex w-full flex-col items-center">
    <h1 class="mb-4 text-2xl font-semibold">Account {{ user.username }}</h1>
  </div>
</template>

<style scoped></style>
