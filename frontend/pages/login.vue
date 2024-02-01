<script lang="ts" setup>
import { useAuthStore } from "~/stores/useAuthStore";
import type { LoginInput } from "~/types/types";
import { storeToRefs } from "pinia";

definePageMeta({ middleware: ["guest"] });

const form = ref<LoginInput>({
  email: "",
  password: "",
});

const form_errors = ref<LoginInput>({
  email: "",
  password: "",
});

const auth = useAuthStore();

const { user } = storeToRefs(auth);

const clearErrors = () => {
  form_errors.value.email = "";
  form_errors.value.password = "";
};

const handleLogin = async () => {
  try {
    await auth.login(form.value);
    await navigateTo({ path: "/users/" + user.value.id });
  } catch (err: any) {
    clearErrors();

    if (err.data?.statusCode == 400) {
      if (err.data.message === "wrong_credentials") {
        form_errors.value.email = "Invalid credentials";
      } else {
        form_errors.value = err.data.errors;
      }
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
        {{ $t("pages.login.title") }}
      </h2>
    </div>
    <div
      class="mt-10 p-10 mx-auto rounded-xl border border-green-700 w-full max-w-md"
    >
      <form
        action="#"
        autocomplete="off"
        class="space-y-6"
        @submit.prevent="handleLogin"
      >
        <div v-if="form_errors?.email" class="text-red-700">
          {{ form_errors?.email }}
        </div>
        <div>
          <label class="block text-sm text-gray-800 mb-1" for="email"
            >Email</label
          >
          <input
            id="email"
            v-model="form.email"
            autocomplete="user-email"
            class="w-full rounded-md"
            name="email"
            placeholder="Email"
            type="text"
          />
        </div>
        <div class="border">
          <div v-if="form_errors?.password" class="text-red-700">
            {{ form_errors?.password }}
          </div>
          <label class="block text-sm text-gray-800 mb-1" for="password"
            >Password</label
          >
          <input
            id="password"
            v-model="form.password"
            autocomplete="current-password"
            class="w-full rounded-md"
            name="password"
            placeholder="Password"
            type="password"
          />
        </div>

        <div>
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
            type="submit"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
