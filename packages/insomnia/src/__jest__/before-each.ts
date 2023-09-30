import { database as db } from '../common/database';
import * as models from '../models';
/**** ><> ↑ --------- Import statements ->  */

export async function globalBeforeEach() {
  // Setup the local database in case it's used
  await db.init(
    models.types(),
    {
      inMemoryOnly: true,
    },
    true,
    () => {},
  );
}
/**** ><> ↑ --------- Definition of the function `globalBeforeEach` ->  */
