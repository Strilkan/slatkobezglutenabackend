/**
 * recept controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::recept.recept", ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    
    try {
      // Check if id is numeric or documentId
      const isNumeric = !isNaN(Number(id)) && !isNaN(parseFloat(id));
      
      let entity;
      if (isNumeric) {
        // Find by numeric id
        const entities = await strapi.entityService.findMany("api::recept.recept", {
          filters: { id: Number(id) },
          populate: ctx.query.populate || "*",
        });
        entity = entities?.[0];
      } else {
        // For documentId, get all entities and find by documentId
        const allEntities = await strapi.entityService.findMany("api::recept.recept", {
          populate: ctx.query.populate || "*",
          limit: -1, // Get all
        });
        entity = allEntities.find((e: any) => e.documentId === id);
      }

      if (!entity) {
        return ctx.notFound();
      }

      ctx.body = { data: entity };
    } catch (error) {
      console.error("Error in recept findOne:", error);
      return ctx.notFound();
    }
  },

  async update(ctx) {
    const { id } = ctx.params;
    
    try {
      // Check if id is numeric or documentId
      const isNumeric = !isNaN(Number(id)) && !isNaN(parseFloat(id));
      
      let entity;
      if (isNumeric) {
        // Find by numeric id
        const entities = await strapi.entityService.findMany("api::recept.recept", {
          filters: { id: Number(id) },
        });
        entity = entities?.[0];
      } else {
        // For documentId, get all entities and find by documentId
        const allEntities = await strapi.entityService.findMany("api::recept.recept", {
          limit: -1,
        });
        entity = allEntities.find((e: any) => e.documentId === id);
      }

      if (!entity) {
        return ctx.notFound();
      }

      // Use documentId for update
      const updateId = entity.documentId || entity.id;
      
      // Update with documentId
      const updated = await strapi.entityService.update("api::recept.recept", updateId, {
        data: ctx.request.body.data,
        populate: ctx.query.populate || "*",
      });

      return { data: updated };
    } catch (error) {
      console.error("Error in recept update:", error);
      return ctx.badRequest();
    }
  },

  async delete(ctx) {
    const { id } = ctx.params;
    
    try {
      // Check if id is numeric or documentId
      const isNumeric = !isNaN(Number(id)) && !isNaN(parseFloat(id));
      
      let entity;
      if (isNumeric) {
        // Find by numeric id
        const entities = await strapi.entityService.findMany("api::recept.recept", {
          filters: { id: Number(id) },
        });
        entity = entities?.[0];
      } else {
        // For documentId, get all entities and find by documentId
        const allEntities = await strapi.entityService.findMany("api::recept.recept", {
          limit: -1,
        });
        entity = allEntities.find((e: any) => e.documentId === id);
      }

      if (!entity) {
        return ctx.notFound();
      }

      // Use documentId for delete
      const deleteId = entity.documentId || entity.id;
      
      // Delete with documentId
      const deleted = await strapi.entityService.delete("api::recept.recept", deleteId);

      return { data: deleted };
    } catch (error) {
      console.error("Error in recept delete:", error);
      return ctx.badRequest();
    }
  },
}));
