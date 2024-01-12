<script lang="ts" setup>
import { useClientApi } from "#imports";
import type { CreatePageInput } from "~/types/types";

definePageMeta({ middleware: ["auth"] });

const localPath = useLocalePath();

const form = ref<CreatePageInput>({
  title: "",
  slug: "",
  description: "",
});

const form_errors = ref<CreatePageInput>({
  title: "",
  slug: "",
});

const clearErrors = () => {
  form_errors.value.title = "";
  form_errors.value.slug = "";
  form_errors.value.description = "";
};

const api = useClientApi();
const handleCreatePage = async () => {
  try {
    const data = await api.account.createPage(form.value);

    if (data) {
      navigateTo("/account");
    }
  } catch (err: any) {
    clearErrors();

    if (err.data?.statusCode == 400) {
      form_errors.value = err.data?.errors;
    } else {
      console.error(err.stack);
    }
  }
};
</script>

<template>
  <div class="flex flex-col justify-center p-6 pb-12">
    <div class="mx-auto max-w-md">
      <h2 class="mt-6 text-3xl font-bold text-gray-700">
        {{ $t("pages.register.title") }}
      </h2>
    </div>
    <div
      class="mt-10 p-10 mx-auto rounded-xl border border-green-700 w-full max-w-md"
    >
      <form
        action="#"
        autocomplete="off"
        class="space-y-6"
        @submit.prevent="handleCreatePage"
      >
        <div>
          <div v-if="form_errors?.title" class="text-red-700">
            {{ form_errors?.title }}
          </div>
          <label class="block text-sm text-gray-800 mb-1" for="username"
            >Title</label
          >
          <input
            v-model="form.title"
            class="w-full rounded-md"
            name="title"
            placeholder="Page title"
            type="text"
          />
        </div>

        <div>
          <div v-if="form_errors?.slug" class="text-red-700">
            {{ form_errors?.slug }}
          </div>
          <label class="block text-sm text-gray-800 mb-1" for="username"
            >Page url shortname</label
          >
          <input
            v-model="form.slug"
            class="w-full rounded-md"
            name="title"
            placeholder="Page title"
            type="text"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-800 mb-1" for="email"
            >Description</label
          >
          <textarea
            v-model="form.description"
            name="description"
            placeholder="Page description"
          ></textarea>
        </div>
        <div>
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
            type="submit"
          >
            Create page
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
