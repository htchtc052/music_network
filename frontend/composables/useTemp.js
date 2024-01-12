const util = require("util");

export default function ({ $axios, app, store, $config, env }) {
  $axios.onRequest((request) => {
    let token = store.getters["auth/token"];

    if (token) {
      request.headers["x-token"] = token;
    }

    if (process.server) {
      console.log(
        `Ssr axios req baseUrl=${request.baseURL} url=${request.url} !!`
      );
    }
    //if (process.client) {
    request.headers["Accept-Language"] = app.i18n.locale;
    //}
  });

  $axios.onResponse((response) => {
    if (process.server) {
      console.log(
        `Ssr axios resp [${response.status}] ${response.request.path}`
      );
    }
  });

  $axios.onError((error) => {
    if (!error.response) {
      return Promise.reject("Api not response");
    }

    if (error.response && error.response.status == 401) {
      if (
        error.config &&
        error.config.headers &&
        error.config.headers.is_refresh_req
      ) {
        return Promise.reject(error);
      }

      if (error.config && error.config._retry) {
        console.log(`axios onError 401 handle. retry`);
        return Promise.reject(error);
      }

      const refreshToken = store.getters["auth/refreshToken"] || null;

      console.log(
        `axios onError 401 handle. need refresh refreshToken=${refreshToken}`
      );

      if (!refreshToken) {
        return Promise.reject(error);
      }

      return $axios
        .$post(
          "guest/refreshToken ",
          {
            refreshToken,
          },
          {
            headers: {
              is_refresh_req: 1,
            },
          }
        )
        .then((data) => {
          console.debug(`Success refresh token`);

          let token = data ? data.token : null;

          if (token) {
            app.$authPlugin.setRefreshedToken({ token });
          }

          error.config._retry = true;

          return $axios(error.config);
        })
        .catch((refreshError) => {
          return Promise.reject(refreshError);
        });
    }

    return Promise.reject(error);
  });
}
