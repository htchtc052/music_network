<script lang="ts" setup>
import { useAuthStore } from "~/stores/useAuthStore";
import Register from "~/pages/register.vue";
import type { RegisterInput } from "~/types/types";

definePageMeta({ middleware: ["guest"] });

const localPath = useLocalePath();

const form = ref<RegisterInput>({
  username: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const form_errors = ref<RegisterInput>({
  username: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const clearErrors = () => {
  form_errors.value.username = "";
  form_errors.value.email = "";
  form_errors.value.password = "";
  form_errors.value.password_confirmation = "";
};

const auth = useAuthStore();

const handleRegister = async () => {
  try {
    await auth.register(form.value);
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
        @submit.prevent="handleRegister"
      >
        <div>
          <div v-if="form_errors?.email" class="text-red-700">
            {{ form_errors?.username }}
          </div>
          <label class="block text-sm text-gray-800 mb-1" for="username"
            >Username</label
          >
          <input
            v-model="form.username"
            class="w-full rounded-md"
            name="username"
            placeholder="User name"
            type="text"
          />
        </div>

        <div>
          <div v-if="form_errors?.email" class="text-red-700">
            {{ form_errors?.email }}
          </div>
          <label class="block text-sm text-gray-800 mb-1" for="email"
            >Email</label
          >
          <input
            v-model="form.email"
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
            v-model="form.password"
            class="w-full rounded-md"
            name="password"
            placeholder="Password"
            type="password"
          />
        </div>
        <div>
          <div v-if="form_errors?.password_confirmation" class="text-red-700">
            {{ form_errors?.password_confirmation }}
          </div>
          <label
            class="block text-sm text-gray-800 mb-1"
            for="password_confirmation"
            >Confirm password</label
          >
          <input
            v-model="form.password_confirmation"
            class="w-full rounded-md"
            name="password_confirmation"
            placeholder="Password confirm"
            type="password"
          />
        </div>
        <div>
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
