import { useAuthStore } from "~/stores/useAuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();
  //console.debug(`run guest midd`, auth.isLoggedIn, auth.user);

  if (auth.isLoggedIn) {
    //console.debug("run guest midd");
    return navigateTo("/account");
  }
});
