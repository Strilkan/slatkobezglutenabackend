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

      // Use documentId for update (Strapi v5 prefers documentId)
      const updateId = entity.documentId || entity.id;
      
      console.log(`Updating recept ${updateId} (original ID: ${id}, numeric ID: ${entity.id}) with data:`, ctx.request.body.data);
      console.log(`Entity before update:`, { id: entity.id, documentId: entity.documentId, Naslov: entity.Naslov || entity.attributes?.Naslov });
      
      // Pokušaj update s documentId
      let updated;
      let updateSuccess = false;
      
      try {
        updated = await strapi.entityService.update("api::recept.recept", updateId, {
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
          updated = await strapi.entityService.update("api::recept.recept", entity.id, {
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
          await strapi.db.query("api::recept.recept").update({
            where: { id: entity.id },
            data: ctx.request.body.data,
          });
          // Nakon query builder update, dohvati ažurirani entitet
          const updatedEntities = await strapi.entityService.findMany("api::recept.recept", {
            filters: { id: entity.id },
            populate: ctx.query.populate || "*",
          });
          updated = updatedEntities[0];
          console.log(`Update successful with query builder`);
          updateSuccess = true;
        } catch (queryErr) {
          console.error(`Update with query builder failed:`, queryErr);
          throw new Error(`Failed to update recept: ${queryErr.message}`);
        }
      }
      
      // Provjeri da li je stvarno ažuriran
      await new Promise(resolve => setTimeout(resolve, 200)); // Pričekaj malo
      
      const verifyUpdated = await strapi.entityService.findMany("api::recept.recept", {
        filters: { id: entity.id },
        populate: ctx.query.populate || "*",
      });
      
      if (verifyUpdated.length === 0) {
        console.error(`⚠️ WARNING: Recept ${updateId} not found after update!`);
      } else {
        const verified = verifyUpdated[0];
        console.log(`✅ Verified: Recept ${updateId} successfully updated`);
        console.log(`Updated data:`, {
          Naslov: verified.Naslov || verified.attributes?.Naslov,
          Istaknuto: verified.Istaknuto || verified.attributes?.Istaknuto,
        });
        // Koristi verificirani entitet ako je drugačiji
        if (!updated || !updated.Naslov) {
          updated = verified;
        }
      }

      // Return in Strapi format
      ctx.body = { data: updated };
      return ctx.body;
    } catch (error) {
      console.error("Error in recept update:", error);
      console.error("Update error details:", {
        id,
        error: error.message,
        stack: error.stack
      });
      return ctx.badRequest("Update failed");
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

      // Use documentId for delete (Strapi v5 prefers documentId)
      const deleteId = entity.documentId || entity.id;
      
      console.log(`Deleting recept with ID: ${deleteId} (original: ${id}, numeric ID: ${entity.id})`);
      console.log(`Entity to delete:`, { id: entity.id, documentId: entity.documentId, Naslov: entity.Naslov || entity.attributes?.Naslov });
      
      // Pokušaj obrisati - Strapi v5 može koristiti i documentId i numeric ID
      let deleted;
      let deleteSuccess = false;
      
      // Prvo pokušaj s documentId
      try {
        deleted = await strapi.entityService.delete("api::recept.recept", deleteId);
        console.log(`Delete result with documentId ${deleteId}:`, deleted);
        deleteSuccess = true;
      } catch (deleteErr) {
        console.error(`Delete with documentId failed:`, deleteErr);
      }
      
      // Ako documentId ne radi, pokušaj s numeric ID
      if (!deleteSuccess) {
        try {
          deleted = await strapi.entityService.delete("api::recept.recept", entity.id);
          console.log(`Delete result with numeric ID ${entity.id}:`, deleted);
          deleteSuccess = true;
        } catch (numericErr) {
          console.error(`Delete with numeric ID failed:`, numericErr);
        }
      }
      
      // Ako ništa ne radi, pokušaj kroz query builder
      if (!deleteSuccess) {
        try {
          await strapi.db.query("api::recept.recept").delete({ where: { id: entity.id } });
          console.log(`Delete successful with query builder`);
          deleted = entity; // Return original entity as deleted
          deleteSuccess = true;
        } catch (queryErr) {
          console.error(`Delete with query builder failed:`, queryErr);
          throw new Error(`Failed to delete recept: ${queryErr.message}`);
        }
      }
      
      // Provjeri da li je stvarno obrisan
      await new Promise(resolve => setTimeout(resolve, 200)); // Pričekaj malo
      
      const verifyDeleted = await strapi.entityService.findMany("api::recept.recept", {
        filters: { id: entity.id },
      });
      
      if (verifyDeleted.length > 0) {
        console.error(`⚠️ WARNING: Recept ${deleteId} still exists after delete!`);
        // Pokušaj još jednom kroz query builder
        try {
          await strapi.db.query("api::recept.recept").delete({ where: { id: entity.id } });
          console.log(`Force delete with query builder successful`);
        } catch (forceErr) {
          console.error(`Force delete failed:`, forceErr);
        }
      } else {
        console.log(`✅ Verified: Recept ${deleteId} successfully deleted`);
      }
      
      // Return in Strapi format
      ctx.body = { data: deleted };
      return ctx.body;
    } catch (error) {
      console.error("Error in recept delete:", error);
      console.error("Delete error details:", {
        id,
        error: error.message,
        stack: error.stack
      });
      return ctx.badRequest("Delete failed");
    }
  },
}));
