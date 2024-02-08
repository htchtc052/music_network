<script lang="ts" setup>
import Player from "~/components/Player.vue";
import { useAuthStore } from "~/stores/useAuthStore";

const localPath = useLocalePath();
const auth = useAuthStore();

const user = auth.user;
const isLoggedIn = auth.isLoggedIn;

const handleLogout = async function() {
  await auth.logout();
};
</script>

<template>
  <UiContainer class="flex min-h-dvh justify-center">
    <header>
      <UiNavbar sticky>
        <UiContainer class="flex items-center justify-between">
          <NuxtLink to="/"><img alt="" src="../assets/icons/logo.svg"></NuxtLink>
          <div class="flex">
            <div v-if="isLoggedIn">
              <button
                class="rounded-md bg-blue-500 px-4 py-2 text-gray-800"
                type="submit"
                @click="handleLogout"
              >
                Logout
              </button>
              <nuxt-link :to="localPath('/account')" class="ml-4">
                Account ({{ user?.email }})
              </nuxt-link>
            </div>
            <div v-else class="flex">
              <nuxt-link
                :to="localPath('/register')"
                class="nav_link ml-4 rounded-md bg-green-500 px-4 py-2 text-white"
              >
                Register
              </nuxt-link>
              <nuxt-link
                :to="localPath('/login')"
                class="nav_link ml-4 rounded-md bg-green-500 px-4 py-2 text-white"
              >
                Login
              </nuxt-link>
            </div>

          </div>
        </UiContainer>
      </UiNavbar>
    </header>
    <slot />
    <footer>
      <Player></Player>
    </footer>
  </UiContainer>
</template>


<!--
      <div class="main_menu">
        <nuxt-link :to="localPath('/tracks')" class="bg-blue-700 px-4 py-2 text-white">
          Tracks
        </nuxt-link>
      </div>

         <LangSwitcher />
      -->

<!--            <UiButton size="icon-sm" title="Logout" variant="ghost">
              <span class="sr-only">Logout</span>
              <Icon class="h-4 w-4" name="lucide:log-out" />
            </UiButton>-->