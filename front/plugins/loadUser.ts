import { useAuthStore } from "~/stores/useAuthStore";

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore();
  const user = computed(() => auth.user);

  const accessToken = useCookie("accessToken");
  console.debug(`loadUser.ts need load accessToken`, accessToken.value ? true : false);

  console.debug(`loadUser.ts need load user.id`, user.value?.id);

  if (accessToken.value && !user.value?.id) {
    try {
      await auth.fetchUser();
      console.error(`loadUser.ts success`);

      console.debug(`fetchUser success`, auth.user?.id);
    } catch (err: any) {
      console.error(`loadUser.ts err`, err.statusCode);
    }
  }
});
