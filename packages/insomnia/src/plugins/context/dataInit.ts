import { exportWorkspacesData, exportWorkspacesHAR } from '../../common/export';
import { fetchImportContentFromURI, scanResources } from '../../common/import';
import { importResourcesToProject } from '../../common/importResourcesToProject';
import { InsomniaExport, getWorkspaces, HarExport } from './data';

// Only in the case of running unit tests from Inso via send-request can activeProjectId be undefined. This is because the concept of a project doesn't exist in git/insomnia sync or an export file

export const init = (activeProjectId?: string) => ({
  data: {
    import: {
      uri: async (uri: string) => {
        if (!activeProjectId) {
          return;
        }

        const content = await fetchImportContentFromURI({
          uri,
        });

        await scanResources({
          content,
        });

        await importResourcesToProject({
          projectId: activeProjectId,
        });
      },
      raw: async (content: string) => {
        if (!activeProjectId) {
          return;
        }
        await scanResources({
          content,
        });

        await importResourcesToProject({
          projectId: activeProjectId,
        });
      },
    },
    export: {
      insomnia: async ({
        workspace, includePrivate, format,
      }: InsomniaExport = {}) => exportWorkspacesData(
        workspace ? [workspace] : await getWorkspaces(activeProjectId),
        Boolean(includePrivate),
        format || 'json'
      ),

      har: async ({
        workspace, includePrivate,
      }: HarExport = {}) => exportWorkspacesHAR(
        workspace ? [workspace] : await getWorkspaces(activeProjectId),
        Boolean(includePrivate)
      ),
    },
  },
});
