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

export async function renderApp() {

  const prevLocationHistoryEntry = localStorage.getItem('locationHistoryEntry');
  let beginningPath: string | null = null

  // if (!prevLocationHistoryEntry) {
  const workspaceNumber = await database.count<Workspace>(models.workspace.type)
  console.log("workspaces detected ~>", workspaceNumber);

  if (workspaceNumber === 0) {
    const [d, wId, rId] = dummyStartingWorkspace()
    const newObj = await importPure(d) as {
      resources: { resources: models.BaseModel[] }[];
    }

    const r = (newObj.resources?.[0]?.resources as BaseModel[]).find((a) => a.type === "Request")
    const w = (newObj.resources?.[0]?.resources as BaseModel[]).find((a) => a.type === "Workspace")
    if (w && r)
      beginningPath = `/organization/org_default-project/project/proj_default-project/workspace/${w._id}/debug/request/${r._id}`

    // console.log("newPath", beginningPath)
  }

  // }

  const router = setupRouterStuff(beginningPath);

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
