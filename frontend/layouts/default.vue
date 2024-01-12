<script lang="ts" setup>
import { useAuthStore } from "~/stores/useAuthStore";
import Player from "~/components/Player.vue";

const localPath = useLocalePath();
const auth = useAuthStore();

const user = auth.user;
const isLoggedIn = auth.isLoggedIn;

const handleLogout = async function () {
  await auth.logout();
};
</script>

<template>
  <div class="DefaultLayout">
    <header class="flex justify-between">
      <div><LangSwitcher /></div>

      <div class="flex">
        <div v-if="isLoggedIn" class="text-green-700">
          <button
            class="bg-blue-500 text-gray-800 px-4 py-2 rounded-md"
            type="submit"
            @click="handleLogout"
          >
            Logout
          </button>

          <nuxt-link :to="localPath('/account')" class="nav_link ml-4">
            Account ({{ user?.email }})
          </nuxt-link>
        </div>
        <div v-else class="flex">
          <nuxt-link
            :to="localPath('/register')"
            class="nav_link bg-green-500 text-white px-4 py-2 rounded-md ml-4"
          >
            Register
          </nuxt-link>
          <nuxt-link
            :to="localPath('/login')"
            class="nav_link bg-green-500 text-white px-4 py-2 rounded-md ml-4"
          >
            Login
          </nuxt-link>
        </div>
      </div>
    </header>
    <slot />
    <footer>
      <Player></Player>
    </footer>
  </div>
</template>
