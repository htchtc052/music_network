import { useAuthStore } from "~/stores/useAuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();
  console.debug(`run guest midd`, auth.user);

  if (auth.user?.id) {
    //console.debug("run guest midd");
    return navigateTo("/account");
  }
});
