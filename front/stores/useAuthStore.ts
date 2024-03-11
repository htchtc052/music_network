import { useClientApi } from "~/composables/useClientApi";

import {defineStore} from "pinia";
import type {AuthUserData, LoginInput, RegisterData, TokensData, User} from "~/types/types";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User>();


  const accessToken = useCookie("accessToken", {
    maxAge: 60 * 60, // 1 hour
  });

  const refreshToken = useCookie("refreshToken", {
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  const setAuthUserData = (data: AuthUserData) => {
    setUser(data.user);
    setTokensCookies(data);
  };

  const setTokensCookies = (data: TokensData) => {
    accessToken.value = data.accessToken;
    refreshToken.value = data.refreshToken;
  };

  const setUser = (data: User) => (user.value = data);

  const api = useClientApi();

  async function register(registerData: RegisterData): Promise<void> {
    const data: AuthUserData = await api.auth.register(registerData);

    if (data) {
      setAuthUserData(data);
    }
  }

  async function login(loginInput: LoginInput): Promise<void> {
    const data: AuthUserData = await api.auth.login(loginInput);
    console.debug(data)
    if (data) {
      setAuthUserData(data);
    }
  }

  async function fetchUser() {
    const user: User = await api.auth.fetchUser();

    //console.debug(`fetchUser`, user.email);
    if (user) {
      setUser(user);
    }
  }

  function logout() {
    user.value = undefined;
    setTokensCookies({ accessToken: null, refreshToken: null });

    //navigateTo("/login");
  }

  return {
    user,
    register,
    login,
    fetchUser,
    logout,
    setTokensCookies,
  };
});
