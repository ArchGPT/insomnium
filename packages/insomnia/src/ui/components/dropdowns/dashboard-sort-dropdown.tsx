import React, { FC } from 'react';

import { DASHBOARD_SORT_ORDERS, DashboardSortOrder, dashboardSortOrderName } from '../../../common/constants';
import { Dropdown, DropdownButton, DropdownItem, ItemContent } from '../base/dropdown';

/**** ><> ↑ --------- Importing necessary modules and constants ->  */
interface DashboardSortDropdownProps {
  value: DashboardSortOrder;
  onSelect: (value: DashboardSortOrder) => void;
}
/**** ><> ↑ --------- Defining the props for DashboardSortDropdown component ->  */

export const DashboardSortDropdown: FC<DashboardSortDropdownProps> = ({ onSelect, value }) => {
  return (
/**** ><> ↑ --------- Creating the DashboardSortDropdown component ->  */
    <Dropdown
      aria-label='Dashboard Sort Dropdown'
      className="margin-left"
      triggerButton={
        <DropdownButton
          variant='outlined'
          removePaddings={false}
          disableHoverBehavior={false}
        >
          <i className="fa fa-sort" />
        </DropdownButton>
      }
    >
      {DASHBOARD_SORT_ORDERS.map(order => (
        <DropdownItem
          key={order}
          aria-label={dashboardSortOrderName[order]}
        >
          <ItemContent
            label={dashboardSortOrderName[order]}
            isSelected={order === value}
            onClick={() => onSelect(order)}
          />
        </DropdownItem>
      ))}
    </Dropdown>
/**** ><> ↑ --------- Defining the Dropdown component and its children ->  */
  );
};
/**** ><> ↑ --------- Closing the DashboardSortDropdown component ->  */
