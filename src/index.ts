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
        const publicPermissions = [
          { action: 'api::recept.recept.find', enabled: true },
          { action: 'api::recept.recept.findOne', enabled: true },
          { action: 'api::putovanja.putovanja.find', enabled: true },
          { action: 'api::putovanja.putovanja.findOne', enabled: true },
          { action: 'api::kategorija.kategorija.find', enabled: true },
          { action: 'api::kategorija.kategorija.findOne', enabled: true },
        ];

        await strapi
          .plugin('users-permissions')
          .service('permission')
          .updatePermissions(publicRole.id, publicPermissions);
      }

      if (authenticatedRole) {
        // Authenticated role: Allow full CRUD for all content types
        const authenticatedPermissions = [
          // Recept
          { action: 'api::recept.recept.find', enabled: true },
          { action: 'api::recept.recept.findOne', enabled: true },
          { action: 'api::recept.recept.create', enabled: true },
          { action: 'api::recept.recept.update', enabled: true },
          { action: 'api::recept.recept.delete', enabled: true },
          // Putovanja
          { action: 'api::putovanja.putovanja.find', enabled: true },
          { action: 'api::putovanja.putovanja.findOne', enabled: true },
          { action: 'api::putovanja.putovanja.create', enabled: true },
          { action: 'api::putovanja.putovanja.update', enabled: true },
          { action: 'api::putovanja.putovanja.delete', enabled: true },
          // Kategorija
          { action: 'api::kategorija.kategorija.find', enabled: true },
          { action: 'api::kategorija.kategorija.findOne', enabled: true },
          { action: 'api::kategorija.kategorija.create', enabled: true },
          { action: 'api::kategorija.kategorija.update', enabled: true },
          { action: 'api::kategorija.kategorija.delete', enabled: true },
          // Upload permissions
          { action: 'plugin::upload.read', enabled: true },
          { action: 'plugin::upload.assets.create', enabled: true },
          { action: 'plugin::upload.assets.update', enabled: true },
          { action: 'plugin::upload.assets.download', enabled: true },
        ];

        await strapi
          .plugin('users-permissions')
          .service('permission')
          .updatePermissions(authenticatedRole.id, authenticatedPermissions);
      }

      console.log('✅ Permissions configured successfully');
    } catch (error) {
      console.error('⚠️ Error configuring permissions:', error);
      console.log('ℹ️ You can configure permissions manually in the admin panel');
    }
  },
};
