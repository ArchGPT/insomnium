import { useAsync } from 'react-use';

import { onLoginLogout } from '../../account/session';
import FileSystemDriver from '../../sync/store/drivers/file-system-driver';
import { migrateCollectionsIntoRemoteProject } from '../../sync/vcs/migrate-collections';
import { VCS } from '../../sync/vcs/vcs';
/**** ><> ↑ --------- Module imports ->  */

const check = async () => {
  const driver = FileSystemDriver.create(process.env['INSOMNIA_DATA_PATH'] || window.app.getPath('userData'));
  await migrateCollectionsIntoRemoteProject(new VCS(driver));
};
/**** ><> ↑ --------- Check function definition ->  */

// Check on login / logout
onLoginLogout(isLoggedIn => {
  if (isLoggedIn) {
    check();
  }
});
/**** ><> ↑ --------- Login / Logout callback ->  */

export const useSyncMigration = () => {
  // Check once on mount
  useAsync(check, []);
};
/**** ><> ↑ --------- useSyncMigration hook ->  */
