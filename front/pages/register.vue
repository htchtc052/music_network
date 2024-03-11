<script lang="ts" setup>
import {boolean, type InferType, object, ref as yupRef, string} from 'yup';
import type {FormSubmitEvent} from '#ui/types'

definePageMeta({ middleware: ["guest"] });

const registerSchema = object({
  username: string().required('Username required field'),
  email: string().email('Email is invalid').required('Email required field'),
  password: string().min(4, 'Password must be at least 4 characters').required('Password required field'),
  passwordConfirm: string()
      .required('Password confirm required field')
      .oneOf([yupRef('password')], 'Passwords do not match'),
  agree: boolean().oneOf([true], 'You must agree to the terms and conditions'),

})

type RegisterSchema = InferType<typeof registerSchema>

const formState = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  agree: true
})

const isLoading = ref<boolean>(false);
const auth = useAuthStore();

const form = ref()
async function onSubmit(event: FormSubmitEvent<RegisterSchema>) {
  form.value.clear()
  try {
    isLoading.value = true;

    await auth.register({
      username: event.data.username,
      email: event.data.email,
      password: event.data.password
    });
    //await navigateTo({ path: "/users/" + user.value?.id });
  } catch (error: any) {
    console.error(error);
    if (error.statusCode === 400){
      if (error.data.errors.email === "EMAIL_BUSY") {
        form.value.setErrors([{ path: 'email', message: 'Email busy'}])
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
        <div class="text-2xl self-center">Register form</div>
        <div class="text-sm self-center text-muted-foreground">
          Create your account
        </div>
      </div>
    </template>

    <UForm ref="form" :state="formState" :schema="registerSchema" @submit="onSubmit">

      <UFormGroup name="username" label="User name" class="mb-3" required>
        <UInput type="text" v-model="formState.username" placeholder="Enter your username"/>
      </UFormGroup>

      <UFormGroup name="email" label="Email" class="mb-3" required>
        <UInput type="text" v-model="formState.email" placeholder="Enter your email"/>
      </UFormGroup>

      <UFormGroup name="password" label="Password" class="mb-3" required>
        <UInput type="password" v-model="formState.password" placeholder="Enter password"/>
      </UFormGroup>

      <UFormGroup name="passwordConfirm" label="Password confirm" class="mb-3" required>
        <UInput type="password" v-model="formState.passwordConfirm" placeholder="Password confirm"/>
      </UFormGroup>

      <UFormGroup name="agree" label="I agree to terms and conditions" class="mb-3">
        <UCheckbox
            v-model="formState.agree"
        />
      </UFormGroup>
      <UButton class="mb-3" type="submit" block :loading="isLoading">Register</UButton>
    </UForm>

    </UCard>
  </UContainer>
</template>