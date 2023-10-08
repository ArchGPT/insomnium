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

export async function renderApp() {

  const workspaceNumber = await database.count<Workspace>(models.workspace.type)
  console.log("workspaces detected ~>", workspaceNumber);
  if (workspaceNumber === 0) await importPure(dummyStartingWorkspace())


  const router = setupRouterStuff();

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
