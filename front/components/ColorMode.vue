<script setup lang="ts">

const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
console.log(colorMode.preference)
</script>
<template>

  <UButton
      color="gray"
      variant="link"
      @click="isDark = !isDark"
      size="xl"
  >{{ isDark ? 'Dark' : 'Light' }}</UButton>



</template>