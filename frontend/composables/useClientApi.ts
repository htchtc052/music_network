import { useFetchInstance } from "~/composables/useFetchInstance";
import type {
  AuthUserData,
  CreatePageInput,
  EditTrackInfoInput,
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
    userProfile: {
      getUserProfile: (id: number) =>
        http<User>("/users/" + id, {
          method: "GET",
        }),
      getUserTracks: (id: number) =>
        http<Track[]>("/users/" + id + "/tracks", {
          method: "GET",
        }),
    },
    tracks: {
      getTrack: (id: number) =>
        http<Track>("/tracks/" + id, {
          method: "GET",
        }),
      getCatalogTracks: () =>
        http<Track[]>("/tracks/", {
          method: "GET",
        }),
      editTrackInfo: (id: number, editTrackInfoInput: EditTrackInfoInput) =>
        http<Track>("/tracks/" + id + "/editTrack", {
          method: "POST",
          body: editTrackInfoInput,
        }),
      deleteTrack: (id: number, editTrackInfoInput: EditTrackInfoInput) =>
        http<Track>("/tracks/" + id + "/deleteTrack", {
          method: "DELETE",
        }),
    },
  };
};
