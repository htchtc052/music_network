import { useAuthStore } from "~/stores/useAuthStore";

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore();
  const accessToken = useCookie("accessToken");
  console.debug(`loadUser.ts need load`, accessToken.value && !auth.isLoggedIn ? true : false);

  if (accessToken.value && !auth.isLoggedIn) {
    try {
      await auth.fetchUser();
      console.error(`loadUser.ts success`);

      //console.debug(`fetchUser success`, auth.user);
    } catch (err: any) {
      console.error(`loadUser.ts err`, err.statusCode);
    }
  }
});
