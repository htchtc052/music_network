import type {
  AuthUserData,
  LoginInput,
  RegisterInput,
  TokensData,
  User,
} from "~/types/types";
import { useClientApi } from "~/composables/useClientApi";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);

  const isLoggedIn = computed(() => !!user.value);

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

  async function register(registerInput: RegisterInput): Promise<void> {
    const data: AuthUserData = await api.auth.register(registerInput);

    if (data) {
      setAuthUserData(data);
    }
  }

  async function login(loginInput: LoginInput): Promise<void> {
    const data: AuthUserData = await api.auth.login(loginInput);
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

  async function logout() {
    user.value = null;
    setTokensCookies({ accessToken: null, refreshToken: null });

    navigateTo("/login");
  }

  return {
    user,
    isLoggedIn,
    register,
    login,
    fetchUser,
    logout,
    setTokensCookies,
  };
});
