<script lang="ts" setup>
import { useAuthStore, useClientApi, useFetchInstance } from "#imports";

import type { ComputedRef } from "vue";
import type { Page } from "~/types/types";

const localPath = useLocalePath();
definePageMeta({ middleware: ["auth"] });

const api = useClientApi();

const { data, pending, error } = await useAsyncData<Page[]>(
  "account.pages",
  async () => api.account.pages()
);

const pages: ComputedRef<Page[]> = computed(() => data.value || []);

const handleDelete = (pageId: number) => {
  console.debug("delete", pageId);
};
</script>
<template>
  <div class="flex flex-col items-center w-full">
    <h1 class="text-2xl font-semibold mb-4">Account</h1>
    <div class="mb-4">
      <nuxt-link
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        to="/account/createPage"
        >Create page</nuxt-link
      >
    </div>
    <div class="text-xl font-bold mb-2">Your pages</div>
    <div v-if="error" class="text-red-500">Error loading pages</div>
    <div v-else-if="pending" class="text-gray-500">Loading...</div>
    <div v-else>
      <div v-if="pages.length" class="flex flex-col items-start w-full pl-5">
        <div
          v-for="page of pages"
          :key="page.id"
          class="mb-1 w-full flex justify-between"
        >
          <span>
            <nuxt-link :to="`/pages/` + page.slug" class="px-4 py-2">{{
              page.title
            }}</nuxt-link></span
          >
          <div>
            <button
              class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 ml-2"
              @click="handleDelete(page.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500">No pages</div>
    </div>
  </div>
</template>

<style scoped></style>
