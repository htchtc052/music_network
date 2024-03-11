import type { TokensData } from "~/types/types";
import { type $Fetch } from "nitropack";

let fetchInstance: $Fetch;

export const useFetchInstance = () => {
  //const auth = useAuthStore();
  const config = useRuntimeConfig();
  const accessToken = useCookie("accessToken");
  const refreshToken = useCookie("refreshToken");

  console.debug(`FetchInstance create`);

  fetchInstance = $fetch.create({
    baseURL: config.public.apiUrl,
    headers: {},
    onRequest({ options }) {
      options.headers = {
        ...(options.headers || {}),
        Authorization:
          accessToken && accessToken.value ? `Bearer ${accessToken.value}` : "",
      };
    },
    async onResponseError(_ctx) {
      if (_ctx.response.status == 401) {
        try {
          console.debug(
            `onResponseError() 401 intercept need refreshToken.value=`,
            refreshToken.value,
            `url`,
            _ctx.response.url
          );

          const data = await $fetch<TokensData>(
            config.public.apiUrl + "/auth/refreshTokens",
            {
              method: "POST",
              body: { refreshToken: refreshToken.value },
            }
          );

          console.debug("onResponseError() 401 intercept after refresh req");
          accessToken.value = data.accessToken;
          refreshToken.value = data.refreshToken;

          return fetchInstance(_ctx.request);
        } catch (err: any) {
          console.error(
            `onResponseError() 401 intercept ERROR refresh req`,
            err.statusCode
          );
          accessToken.value = null;
          refreshToken.value = null;
        }
      } /* else if (_ctx.response.status == 500) {
        console.error(`Api error 500`, _ctx.response._data.message);
        throw createError({
          message: "Server error",
          statusCode: 500,
        });
      }*/
    },
  });

  return fetchInstance;
};
