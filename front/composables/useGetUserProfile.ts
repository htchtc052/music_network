import type { User } from "~/types/types";

export const useGetUserProfile = async () => {
  const route = useRoute();
  const id: number = +route.params.id;

  const api = useClientApi();
  const userProfile = ref<User>({} as User);

  const getUserProfile = async () => {
    const { data, error } = await useAsyncData<User>(() =>
      api.userProfile.getUserProfile(id)
    );

    if (data.value) {
      userProfile.value = data.value;
      return;
    }

    if (error.value) {
      if (error.value?.statusCode === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: "User not found",
          fatal: true,
        });
      } else {
        throw createError({
          statusCode: 500,
          statusMessage: "Server error",
          fatal: true,
        });
      }
    }
  };

  await getUserProfile();

  return userProfile;
};
