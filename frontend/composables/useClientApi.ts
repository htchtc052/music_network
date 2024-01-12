import { useFetchInstance } from "~/composables/useFetchInstance";
import type {
  AuthUserData,
  CreatePageInput,
  LoginInput,
  Page,
  RegisterInput,
  Track,
  User,
} from "~/types/types";

export const useClientApi = () => {
  const http = useFetchInstance();

  return {
    auth: {
      register: (registerInput: RegisterInput) =>
        http<AuthUserData>("/auth/register", {
          method: "POST",
          body: registerInput,
        }),
      login: (loginInput: LoginInput) =>
        http<AuthUserData>("/auth/login", {
          method: "POST",
          body: loginInput,
        }),
      fetchUser: () =>
        http<User>("/auth/me", {
          method: "GET",
        }),
    },
    account: {
      pages: () =>
        http<Page[]>("/account/pages", {
          method: "GET",
        }),
      createPage: (createPageInput: CreatePageInput) =>
        http<Page>("/account/createPage", {
          method: "POST",
          body: createPageInput,
        }),
    },
    pages: {
      getPage: (slug: string) =>
        http<Page>("/pages/" + slug, {
          method: "GET",
        }),
      getPageTracks: (slug: string) =>
        http<Track[]>("/pages/" + slug + "/tracks", {
          method: "GET",
        }),
    },
    tracks: {
      getTrack: (id: number) =>
        http<Track>("/tracks/" + id, {
          method: "GET",
        }),
    },
  };
};
