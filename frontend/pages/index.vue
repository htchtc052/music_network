<script lang="ts" setup>
  const localPath = useLocalePath();
</script>
<template>
  <div>
    <h1>{{ $t("home_title") }}</h1>

    <nuxt-link :to="localPath('/about')" class="nav_link">{{ $t("about_link") }}</nuxt-link>
  </div>
</template>
