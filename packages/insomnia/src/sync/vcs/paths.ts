
export function projects() {
  return '/projects/';
}
/**** ><> ↑ --------- Definition of the projects path ->  */

export function projectBase(projectId: string) {
  return `${projects()}${projectId}/`;
}
/**** ><> ↑ --------- Definition of the base path for a project ->  */

export function head(projectId: string) {
  return `${projectBase(projectId)}head.json`;
}
/**** ><> ↑ --------- Definition of the path to a project's head ->  */

export function project(projectId: string) {
  return `${projectBase(projectId)}meta.json`;
}
/**** ><> ↑ --------- Definition of the path to a project's meta information ->  */

export function blobs(projectId: string) {
  return `${projectBase(projectId)}blobs/`;
}
/**** ><> ↑ --------- Definition of the path to a project's blobs ->  */

export function blob(projectId: string, blobId: string) {
  const subPath = `${blobId.slice(0, 2)}/${blobId.slice(2)}`;
  return `${blobs(projectId)}${subPath}`;
}
/**** ><> ↑ --------- Definition of the path to a specific blob in a project ->  */

export function snapshots(projectId: string) {
  return `${projectBase(projectId)}snapshots/`;
}
/**** ><> ↑ --------- Definition of the path to a project's snapshots ->  */

export function snapshot(projectId: string, snapshotId: string) {
  return `${snapshots(projectId)}${snapshotId}.json`;
}
/**** ><> ↑ --------- Definition of the path to a specific snapshot in a project ->  */

export function branches(projectId: string) {
  return `${projectBase(projectId)}branches/`;
}
/**** ><> ↑ --------- Definition of the path to a project's branches ->  */

export function branch(projectId: string, branchName: string) {
  return `${branches(projectId)}${branchName}.json`;
}
/**** ><> ↑ --------- Definition of the path to a specific branch in a project ->  */
