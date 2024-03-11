<script lang="ts" setup>
import { type InferType, object, string } from "yup";
import type { FormSubmitEvent } from "#ui/types";

definePageMeta({ middleware: ["guest"] });

const loginSchema = object({
  email: string().email("Email is invalid").required("Email required field"),
  password: string().required("Password required field"),
});

type LoginSchema = InferType<typeof loginSchema>;

const formState = reactive({
  email: "",
  password: "",
});

const isLoading = ref<boolean>(false);
const auth = useAuthStore();

const form = ref();
async function onSubmit(event: FormSubmitEvent<LoginSchema>) {
  form.value.clear();
  try {
    isLoading.value = true;

    await auth.login({
      email: event.data.email,
      password: event.data.password,
    });
    await navigateTo({ path: "/" });
  } catch (error: any) {
    console.error(error);
    if (error.statusCode === 400) {
      if (error.data.message === "INVALID_CREDENTIALS") {
        form.value.setErrors([
          { path: "password", message: "Invalid credentials" },
        ]);
      }
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UContainer :ui="{ constrained: 'max-w-screen-md' }">
    <UCard>
      <template #header>
        <div class="flex flex-col gap-y-1">
          <div class="text-2xl self-center">Login form</div>
          <div class="text-sm self-center text-muted-foreground">
            Enter your credentials
          </div>
        </div>
      </template>

      <UForm
        ref="form"
        :schema="loginSchema"
        :state="formState"
        @submit="onSubmit"
      >
        <UFormGroup class="mb-3" label="Email" name="email" required>
          <UInput
            v-model="formState.email"
            placeholder="Enter your email"
            type="text"
          />
        </UFormGroup>

        <UFormGroup class="mb-3" label="Password" name="password" required>
          <UInput
            v-model="formState.password"
            placeholder="Enter password"
            type="password"
          />
        </UFormGroup>

        <UButton :loading="isLoading" block class="mb-3" type="submit"
          >Login</UButton
        >
      </UForm>
    </UCard>
  </UContainer>
</template>
