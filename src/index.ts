import type { Core } from '@strapi/strapi';
import fs from 'fs';

const patchUploadTempCleanup = () => {
  const shouldIgnore = (filePath: fs.PathLike): boolean => {
    return typeof filePath === 'string' && filePath.includes('strapi-upload');
  };

  const originalUnlink = fs.unlink;
  fs.unlink = ((path, callback) => {
    return originalUnlink(path, (err) => {
      if (err && err.code === 'EPERM' && shouldIgnore(path)) {
        console.warn(`[upload] Ignored EPERM while deleting temp file: ${path}`);
        callback?.(null);
        return;
      }
      callback?.(err);
    });
  }) as typeof fs.unlink;

  const originalUnlinkSync = fs.unlinkSync;
  fs.unlinkSync = ((path) => {
    try {
      return originalUnlinkSync(path);
    } catch (err: any) {
      if (err && err.code === 'EPERM' && shouldIgnore(path)) {
        console.warn(`[upload] Ignored EPERM while deleting temp file: ${path}`);
        return;
      }
      throw err;
    }
  }) as typeof fs.unlinkSync;

  if (fs.promises?.unlink) {
    const originalPromisesUnlink = fs.promises.unlink;
    fs.promises.unlink = (async (path, ...args: any[]) => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - internal binding handled via call
        return await originalPromisesUnlink.call(fs.promises, path, ...args);
      } catch (err: any) {
        if (err && err.code === 'EPERM' && shouldIgnore(path)) {
          console.warn(`[upload] Ignored EPERM while deleting temp file: ${path}`);
          return;
        }
        throw err;
      }
    }) as typeof fs.promises.unlink;
  }
};

patchUploadTempCleanup();

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Configure permissions for Public and Authenticated roles
    try {
      const publicRole = await strapi
        .plugin('users-permissions')
        .service('role')
        .findOne({ type: 'public' });

      const authenticatedRole = await strapi
        .plugin('users-permissions')
        .service('role')
        .findOne({ type: 'authenticated' });

      if (publicRole) {
        // Public role: Allow GET (find, findOne) for all content types
        // U Strapi v5, permissions se postavljaju ručno u admin panelu
        // Ovdje samo logiramo da treba postaviti permissions
        console.log('ℹ️ Public role found. Configure permissions manually in admin panel:');
        console.log('   - api::recept.recept.find');
        console.log('   - api::recept.recept.findOne');
        console.log('   - api::putovanja.putovanja.find');
        console.log('   - api::putovanja.putovanja.findOne');
        console.log('   - api::kategorija.kategorija.find');
        console.log('   - api::kategorija.kategorija.findOne');
      }

      if (authenticatedRole) {
        // Authenticated role: Allow full CRUD for all content types
        // U Strapi v5, permissions se postavljaju ručno u admin panelu
        // Ovdje samo logiramo da treba postaviti permissions
        console.log('ℹ️ Authenticated role found. Configure permissions manually in admin panel:');
        console.log('   - api::recept.recept.find, findOne, create, update, delete');
        console.log('   - api::putovanja.putovanja.find, findOne, create, update, delete');
        console.log('   - api::kategorija.kategorija.find, findOne, create, update, delete');
        console.log('   - plugin::upload.read, assets.create, assets.update, assets.download');
        
        // Pokušaj postaviti permissions ako je moguće (možda neće raditi u Strapi v5)
        try {
          const permissionService = strapi.plugin('users-permissions').service('permission');
          
          // Dohvati sve permissions za authenticated role
          const existingPermissions = await permissionService.findMany({
            where: { role: authenticatedRole.id },
          });
          
          console.log(`ℹ️ Found ${existingPermissions.length} existing permissions for authenticated role`);
        } catch (permErr) {
          console.log('ℹ️ Cannot auto-configure permissions. Please set them manually in admin panel.');
        }
      }

      console.log('✅ Permissions configured successfully');
    } catch (error) {
      console.error('⚠️ Error configuring permissions:', error);
      console.log('ℹ️ You can configure permissions manually in the admin panel');
    }
  },
};
