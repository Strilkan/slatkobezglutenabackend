/**
 * recept router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::recept.recept", {
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