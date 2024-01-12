<script lang="ts" setup>
import type { ComputedRef } from "vue";
import { useAuthStore, useFetchInstance } from "#imports";
import { storeToRefs } from "pinia";
import type { Page, Track } from "~/types/types";

const localPath = useLocalePath();

const api = useClientApi();

const route = useRoute();

const slug: string = route.params.slug as string;

const { data, pending, error } = await useAsyncData<{
  page: Page;
}>("page.uploadTrack", async () => {
  const page = await api.pages.getPage(slug);
  return { page };
});

const page = ref<Page>({} as Page);

if (data.value) {
  page.value = data.value.page;
}

console.debug(`page: ` + page.value.title, `error ` + error.value?.stack);

const auth = useAuthStore();
const { user } = storeToRefs(auth);

const isOwner: ComputedRef<boolean> = computed(
  () => page.value.userId === user?.value?.id
);

const file = ref<File | null>(null);

const progress = ref<number>(0);

const onChangeFile = (event: Event) => {
  const [_file] = (event.target as HTMLInputElement).files as FileList;

  file.value = _file;

  console.debug(`onChangeFile set file.value`, file.value);
};

const fetchInstance = useFetchInstance();

const handleFileUpload = async () => {
  try {
    if (!file.value) return;
    console.log("need upload file");

    const body = new FormData();
    body.append("trackFile", file.value, file.value.name);
    const data = await fetchInstance("/pages/" + slug + "/uploadTrack", {
      method: "POST",
      body,
      onUploadProgress: (progressEvent: any) => {
        progress.value = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
      },
    });

    console.log("after upload file", data);
    navigateTo("/pages/" + slug);
  } catch (err) {
    console.error(err);
  }
};

console.debug(`isOwner`, isOwner.value);
</script>
<template>
  <div class="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="mb-4">
      <h1 class="text-2xl font-semibold mb-4">Page: {{ page.title }}</h1>
      <div>Track upload</div>

      <div v-if="progress">{{ progress }}</div>
      <input
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        name="file"
        type="file"
        @change="onChangeFile"
      />
      <div style="margin-top: 20px">
        <button
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click.prevent="handleFileUpload"
        >
          Upload File
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
