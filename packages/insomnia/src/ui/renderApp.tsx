import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { database } from '../common/database';
import * as models from '../models';
import { init as initPlugins } from '../plugins';
import { applyColorScheme } from '../plugins/misc';
import { guard } from '../utils/guard';
import { setupRouterStuff } from './router';
import { dummyStartingWorkspace, importPure } from '../common/import';
import { Workspace } from '../models/workspace';
import { BaseModel } from '../models';
import { getProductName } from '../common/constants';

export async function renderApp() {

  const prevLocationHistoryEntry = localStorage.getItem('locationHistoryEntry');
  let beginningPathForFirstTimeUser: string | null = null;
  let wId: string | null = null;
  let eId: string | null = null;

  // initialize a new req manually on user's first run
  if (!prevLocationHistoryEntry) {
  const workspaceNumber = await database.count<Workspace>(models.workspace.type);
  console.log("workspaces detected ~>", workspaceNumber);

  if (workspaceNumber === 0) {
    const [d] = dummyStartingWorkspace();
    const newObj = await importPure(d) as {
      resources: { resources: models.BaseModel[] }[];
    };

    const r = (newObj.resources?.[0]?.resources as BaseModel[]).find(a => a.type === "Request");
    const w = (newObj.resources?.[0]?.resources as BaseModel[]).find(a => a.type === "Workspace");
    const e = (newObj.resources?.[0]?.resources as BaseModel[]).find(a => a.type === "Environment");
    if (w && r && e) {
      wId = w._id;
      beginningPathForFirstTimeUser = `/organization/org_default-project/project/proj_default-project/workspace/${w._id}/debug/request/${r._id}`;

      const defaultProject = await models.project.getById('proj_default-project');

      if (!defaultProject) {
 (await models.project.create({
          _id: 'proj_default-project',
          name: getProductName(),
          remoteId: null,
        }));
}

      eId = e._id;
      console.log("META DESU->", w._id, beginningPathForFirstTimeUser);
      const id = await models.workspaceMeta.getByParentId(w._id);
      if (!id) {
        const activeWorkspaceMeta = await models.workspaceMeta.getOrCreateByParentId(w._id, {
          activeEnvironmentId: eId,
        });
      }
    }

  }

  }

  const router = setupRouterStuff(beginningPathForFirstTimeUser);

  await database.initClient();

  await initPlugins();

  const settings = await models.settings.getOrCreate();

  await applyColorScheme(settings);

  const root = document.getElementById('root');

  guard(root, 'Could not find root element');

  ReactDOM.createRoot(root).render(
    <RouterProvider router={router} />
  );

}
