export default [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      origin: ["http://localhost:3000", "http://localhost:1337"], // ✅ dozvoli React app i admin
      headers: "*",
      credentials: true,
    },
  },
  {
    name: "strapi::body",
    config: {
      formLimit: "100mb",
      jsonLimit: "100mb",
      textLimit: "100mb",
      formidable: {
        maxFileSize: 100 * 1024 * 1024, // 100MB
        maxFields: 1000,
        maxFieldsSize: 20 * 1024 * 1024, // 20MB
      },
    },
  },
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            "market-assets.strapi.io",
            "https:",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            "market-assets.strapi.io",
            "https:",
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
