import { LoaderFunction, ShouldRevalidateFunction, useRouteLoaderData } from 'react-router-dom';


import { database } from '../../common/database';
import { project } from '../../models';
import { defaultOrganization, Organization } from '../../models/organization';
import { isRemoteProject } from '../../models/project';

export interface LoaderData {
  organizations: Organization[];
}

export const loader: LoaderFunction = async () => {

  return {
    organizations: [defaultOrganization],
  };
};

export const useOrganizationLoaderData = () => {
  return useRouteLoaderData('/organization') as LoaderData;
};

export const shouldOrganizationsRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
  nextUrl,
}) => {
  const isSwitchingBetweenOrganizations = currentParams.organizationId !== nextParams.organizationId;
  // We need this for isLoggedIn to update the organization list
  // The hash gets removed from the URL after the first time it's used so it doesn't revalidate on every navigation
  const shouldForceRevalidate = nextUrl.hash === '#revalidate=true';

  return isSwitchingBetweenOrganizations || shouldForceRevalidate;
};
