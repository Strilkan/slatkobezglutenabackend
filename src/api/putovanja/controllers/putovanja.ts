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

      // Use documentId for update (Strapi v5 prefers documentId)
      const updateId = entity.documentId || entity.id;
      
      console.log(`Updating putovanja ${updateId} (original ID: ${id}, numeric ID: ${entity.id}) with data:`, ctx.request.body.data);
      console.log(`Entity before update:`, { id: entity.id, documentId: entity.documentId, Naslov: entity.Naslov });
      
      // Pokušaj update s documentId
      let updated;
      let updateSuccess = false;
      
      try {
        updated = await strapi.entityService.update("api::putovanja.putovanja", updateId, {
          data: ctx.request.body.data,
          populate: ctx.query.populate || "*",
        });
        console.log(`Update result with documentId ${updateId}:`, updated);
        updateSuccess = true;
      } catch (updateErr) {
        console.error(`Update with documentId failed:`, updateErr);
      }
      
      // Ako documentId ne radi, pokušaj s numeric ID
      if (!updateSuccess) {
        try {
          updated = await strapi.entityService.update("api::putovanja.putovanja", entity.id, {
            data: ctx.request.body.data,
            populate: ctx.query.populate || "*",
          });
          console.log(`Update result with numeric ID ${entity.id}:`, updated);
          updateSuccess = true;
        } catch (numericErr) {
          console.error(`Update with numeric ID failed:`, numericErr);
        }
      }
      
      // Ako ništa ne radi, pokušaj kroz query builder
      if (!updateSuccess) {
        try {
          await strapi.db.query("api::putovanja.putovanja").update({
            where: { id: entity.id },
            data: ctx.request.body.data,
          });
          // Nakon query builder update, dohvati ažurirani entitet
          const updatedEntities = await strapi.entityService.findMany("api::putovanja.putovanja", {
            filters: { id: entity.id },
            populate: ctx.query.populate || "*",
          });
          updated = updatedEntities[0];
          console.log(`Update successful with query builder`);
          updateSuccess = true;
        } catch (queryErr) {
          console.error(`Update with query builder failed:`, queryErr);
          throw new Error(`Failed to update putovanja: ${queryErr.message}`);
        }
      }
      
      // Provjeri da li je stvarno ažuriran
      await new Promise(resolve => setTimeout(resolve, 200)); // Pričekaj malo
      
      const verifyUpdated = await strapi.entityService.findMany("api::putovanja.putovanja", {
        filters: { id: entity.id },
        populate: ctx.query.populate || "*",
      });
      
      if (verifyUpdated.length === 0) {
        console.error(`⚠️ WARNING: Putovanja ${updateId} not found after update!`);
      } else {
        const verified = verifyUpdated[0];
        console.log(`✅ Verified: Putovanja ${updateId} successfully updated`);
        console.log(`Updated data:`, {
          Naslov: verified.Naslov,
          Istaknuto: verified.Istaknuto,
        });
        // Koristi verificirani entitet ako je drugačiji
        if (!updated || !updated.Naslov) {
          updated = verified;
        }
      }
      
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
