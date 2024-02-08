// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },

  alias: {
    //assets: "/<rootDir>/assets",
  },

  css: ["~/assets/main.scss"],

  postcss: {
    plugins: {
      autoprefixer: {}
    }
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL
    }
  },

  modules: [
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "nuxt-icon",
    "@vee-validate/nuxt",
    "@morev/vue-transitions/nuxt"
  ],
  icon: {
    source: "~/assets/icons"
  },

  tailwindcss: { exposeConfig: true },
  colorMode: { classSuffix: "" },
  typescript: { shim: false },

  app: {
    head: {
      title: "Nuxt Petz",
      titleTemplate: "%s - Nuxt Petz"
    }
  },

  i18n: {
    /* module options */
    lazy: true,
    langDir: "locales",
    strategy: "prefix_except_default",
    locales: [
      {
        code: "en-US",
        iso: "en-US",
        name: "English",
        file: "en-US.json"
      },
      {
        code: "ru-RU",
        iso: "ru-RU",
        name: "Russian",
        file: "ru-RU.json"
      }
    ],
    defaultLocale: "en-US"
  },

  pinia: {
    storesDirs: ["./stores/**"]
  },

  build: { transpile: ["vue-sonner"] },

  imports: {
    imports: [{
      from: "tailwind-variants",
      name: "tv"
    }, {
      from: "tailwind-variants",
      name: "VariantProps",
      type: true
    }, {
      from: "vue-sonner",
      name: "toast",
      as: "useSonner"
    }]
  }
});