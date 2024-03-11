<script lang="ts" setup>
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <UContainer
    class="flex flex-col items-center justify-center space-y-4 h-screen text-gray-700"
  >
    <h2 class="text-2xl font-semibold">Error {{ error?.statusCode }}</h2>
    <div class="text-xl">{{ error?.message }}</div>
    <ULink class="underline" @click="handleError">Go to main page</ULink>
  </UContainer>
</template>
