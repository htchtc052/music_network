<script lang="ts" setup>
import { Genders } from "~/types/types";

const userProfile = await useGetUserProfile();

console.debug(`userProfile`, userProfile?.value);
const gender: ComputedRef<string> = computed(() => {
  let gender = "Not specified";
  if (userProfile?.value?.gender === Genders.MALE) {
    gender = "Male";
  } else if (userProfile?.value?.gender === Genders.FEMALE) {
    gender = "Male";
  }
  return gender;
});
</script>
<template>
  <UContainer class="py-4">
    <UserMenu :userProfile="userProfile" />
  </UContainer>
  <UContainer>
    <UCard>
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
          User Profile
        </h3>
      </template>
      <div>
        <div class="divide-y divide-gray-200 dark:divide-gray-800">
          <div class="py-3 grid grid-cols-4 gap-y-2">
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Full name
            </div>
            <div class="mt-1 text-sm text-gray-800 dark:text-gray-200">
              <template v-if="userProfile?.firstName || userProfile?.lastName"
                >{{ userProfile?.firstName }}
                {{ userProfile?.lastName }}
              </template>
              <template v-else>Not specified</template>
            </div>
          </div>

          <div class="py-3 grid grid-cols-4 gap-y-2">
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Joined at
            </div>
            <div class="mt-1 text-sm text-gray-800 dark:text-gray-200">
              {{
                useDateFormat(userProfile?.createdAt, "YYYY-MM-DD hh:mm").value
              }}
            </div>
          </div>

          <div class="py-3 grid grid-cols-4 gap-y-2">
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Gender
            </div>
            <div class="mt-1 text-sm text-gray-800 dark:text-gray-200">
              {{ gender }}
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
<style scoped></style>
