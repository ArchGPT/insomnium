import { useEffect } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
/**** ><> ↑ --------- Module imports from libraries ->  */

import { getProductName } from '../../common/constants';
import { RequestLoaderData } from '../routes/request';
import { WorkspaceLoaderData } from '../routes/workspace';
/**** ><> ↑ --------- Module imports from internal code ->  */
export const useDocumentTitle = () => {
  const {
    activeWorkspace,
    activeEnvironment,
    activeProject,
  } = useRouteLoaderData(':workspaceId') as WorkspaceLoaderData;

  const { activeRequest } = useRouteLoaderData('request/:requestId') as RequestLoaderData;
/**** ><> ↑ --------- Start of the useDocumentTitle hook with route data extraction ->  */

  // Update document title
  useEffect(() => {
    let title;
    if (activeWorkspace && activeWorkspace.name) {
      title = activeProject.name;
      title += ` - ${activeWorkspace.name}`;
      if (activeEnvironment) {
        title += ` (${activeEnvironment.name})`;
      }
      if (activeRequest) {
        title += ` – ${activeRequest.name}`;
      }
    }
/**** ><> ↑ --------- Start of the useEffect hook block for updating document title ->  */
    document.title = title || getProductName();
  }, [activeEnvironment, activeProject.name, activeRequest, activeWorkspace]);

};
/**** ><> ↑ --------- End of useEffect hook and useDocumentTitle hook ->  */
