import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
/**** ><> ↑ --------- Font-Awesome library imports */
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import React from 'react';
/**** ><> ↑ --------- React-Fontawesome and React imports */

library.add(fas, far, fab);
/**** ><> ↑ --------- Adding icons to library */

export const Icon = (props: FontAwesomeIconProps) => (
  <FontAwesomeIcon {...props} />
);
/**** ><> ↑ --------- React Functional Component export */
