import { useAuthStore } from "~/stores/useAuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();
  //console.debug(`run auth midd`, auth.isLoggedIn, auth.user);

  if (!auth.user?.id) {
    //console.debug("run auth midd redirect");
    return navigateTo("/login");
  }
});
