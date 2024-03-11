<script lang="ts" setup>
const auth = useAuthStore();

const user = computed(() => auth.user);

const profileMenuItems = [
  [
    {
      label: "Profile",
      avatar: {
        src: "https://avatars.githubusercontent.com/u/739984?v=4",
      },
      to: "/users/" + user.value?.id,
    },
  ],
  [
    {
      label: "Edit info",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        console.log("Edit");
      },
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-right-start-on-rectangle",
      click: async () => {
        auth.logout();
        await navigateTo({ path: "/login" });
      },
    },
  ],
];
</script>

<template>
  <header class="py-4">
    <UContainer>
      <div class="flex w-full justify-between">
        <NuxtLink class="justify-self-start" to="/"> Logo </NuxtLink>
        <div v-if="user" class="flex gap-x-3">
          <div>
            <nuxt-link :to="`users/` + user?.id + `/tracks`"
              >Your music</nuxt-link
            >
          </div>
          <div>
            <nuxt-link :to="`users/` + user?.id + `/tracks`"
              >Upload track</nuxt-link
            >
          </div>
        </div>
        <div class="justify-end">
          <UDropdown
            v-if="user"
            :items="profileMenuItems"
            :popper="{ placement: 'bottom-end' }"
          >
            <UButton
              :label="user?.username"
              color="white"
              trailing-icon="i-heroicons-chevron-down-20-solid"
            />
          </UDropdown>
          <div v-else class="flex gap-x-3">
            <UButton as-child size="lg">
              <NuxtLink to="/register">Register</NuxtLink>
            </UButton>
            <UButton as-child class="space-x-3" size="lg">
              <NuxtLink to="/login">Login</NuxtLink>
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </header>
</template>

<style scoped></style>
