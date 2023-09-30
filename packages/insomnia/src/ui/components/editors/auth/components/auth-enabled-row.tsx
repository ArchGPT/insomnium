import React, { FC } from 'react';

import { AuthToggleRow } from './auth-toggle-row';
/**** ><> ↑ --------- Importing necessary React modules and components */

export const AuthEnabledRow: FC = () => <AuthToggleRow label="Enabled" property="disabled" invert />;
/**** ><> ↑ --------- Defining the AuthEnabledRow component */
