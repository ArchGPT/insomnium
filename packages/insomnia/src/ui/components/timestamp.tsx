import React, { FunctionComponent } from 'react';
import { format } from 'date-fns';

export const Timestamp: FunctionComponent<{ time: Date | number }> = ({ time }) => {
  const date = format(time, 'HH:mm:ss');
  return <>{date}</>;
};
