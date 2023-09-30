
export const type = 'Organization';
export const prefix = 'org';
/**** ><> ↑ --------- Constants declaration ->  */

export interface Organization {
  _id: string;
  name: string;
}
/**** ><> ↑ --------- Organization interface declaration ->  */

export const DEFAULT_ORGANIZATION_ID = `${prefix}_default-project`;

export const defaultOrganization: Organization = {
  _id: DEFAULT_ORGANIZATION_ID,
  name: 'Personal Projects',
};
/**** ><> ↑ --------- Default organization values ->  */

export const isDefaultOrganization = (organization: Organization) => organization._id === DEFAULT_ORGANIZATION_ID;
/**** ><> ↑ --------- isDefaultOrganization function declaration ->  */
