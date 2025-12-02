/**
 * putovanja controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::putovanja.putovanja", ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    
    try {
      // Check if id is numeric - if so, find by id first to get documentId
      const isNumeric = !isNaN(Number(id)) && !isNaN(parseFloat(id));
      
      let entity;
      if (isNumeric) {
        // Find by numeric id first
        const entities = await strapi.entityService.findMany("api::putovanja.putovanja", {
          filters: { id: Number(id) },
          populate: ctx.query.populate || "*",
        });
        entity = entities?.[0];
      } else {
        // For documentId, get all entities and find by documentId
        const allEntities = await strapi.entityService.findMany("api::putovanja.putovanja", {
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
        const entities = await strapi.entityService.findMany("api::putovanja.putovanja", {
          filters: { id: Number(id) },
        });
        entity = entities?.[0];
      } else {
        // For documentId, get all entities and find by documentId
        const allEntities = await strapi.entityService.findMany("api::putovanja.putovanja", {
          limit: -1,
        });
        entity = allEntities.find((e: any) => e.documentId === id);
      }

      if (!entity) {
        return ctx.notFound();
      }

      // Use documentId for update
      const updateId = entity.documentId || entity.id;
      
      console.log(`Updating putovanja ${updateId} (original ID: ${id}) with data:`, ctx.request.body.data);
      
      // Update with documentId
      const updated = await strapi.entityService.update("api::putovanja.putovanja", updateId, {
        data: ctx.request.body.data,
        populate: ctx.query.populate || "*",
      });

      console.log(`Successfully updated putovanja: ${updateId}`, updated);
      
      // Return in Strapi format using ctx.body
      ctx.body = { data: updated };
      return ctx.body;
    } catch (error) {
      console.error("Error in putovanja update:", error);
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
        const entities = await strapi.entityService.findMany("api::putovanja.putovanja", {
          filters: { id: Number(id) },
        });
        entity = entities?.[0];
      } else {
        // For documentId, get all entities and find by documentId
        const allEntities = await strapi.entityService.findMany("api::putovanja.putovanja", {
          limit: -1,
        });
        entity = allEntities.find((e: any) => e.documentId === id);
      }

      if (!entity) {
        return ctx.notFound();
      }

      // Use documentId for delete
      const deleteId = entity.documentId || entity.id;
      
      console.log(`Deleting putovanja with ID: ${deleteId} (original: ${id})`);
      
      // Delete with documentId
      const deleted = await strapi.entityService.delete("api::putovanja.putovanja", deleteId);

      console.log(`Successfully deleted putovanja: ${deleteId}`);
      
      // Return in Strapi format using ctx.body
      ctx.body = { data: deleted };
      return ctx.body;
    } catch (error) {
      console.error("Error in putovanja delete:", error);
      return ctx.badRequest();
    }
  },
}));
