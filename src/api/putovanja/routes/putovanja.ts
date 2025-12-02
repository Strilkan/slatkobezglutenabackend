/**
 * putovanja router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::putovanja.putovanja", {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
    create: {
      middlewares: [],
    },
    update: {
      middlewares: [],
    },
    delete: {
      middlewares: [],
    },
  },
});
