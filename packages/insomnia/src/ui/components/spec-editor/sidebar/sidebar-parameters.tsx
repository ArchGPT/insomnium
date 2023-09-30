import React, { Component, Fragment, ReactNode } from 'react';

import { IconEnum, SvgIcon } from '../../svg-icon';
import { Tooltip } from '../../tooltip';
import { SidebarInvalidSection } from './sidebar-invalid-section';
import { SidebarItem } from './sidebar-item';
import { SidebarSection } from './sidebar-section';
/**** ><> ↑ --------- Imports necessary libraries and components ->  */

export interface SidebarParametersProps {
  parameters: Record<string, any>;
  onClick: (section: string, ...args: any) => void;
}
/**** ><> ↑ --------- Declares SidebarParametersProps interface ->  */

// Implemented as a class component because of a caveat with render props
// https://reactjs.org/docs/render-props.html#be-careful-when-using-render-props-with-reactpurecomponent
/**** ><> ↑ --------- Commentary about the nature of the SidebarParameters component ->  */
export class SidebarParameters extends Component<SidebarParametersProps> {
  renderBody = (filter: string): null | ReactNode => {
/**** ><> ↑ --------- Declares the SidebarParameters component ->  */
    const { parameters, onClick } = this.props;

    if (Object.prototype.toString.call(parameters) !== '[object Object]') {
      return <SidebarInvalidSection name={'parameter'} />;
    }

    const filteredValues = Object.keys(parameters).filter(parameter =>
      parameter.toLowerCase().includes(filter.toLocaleLowerCase()),
    );

    if (!filteredValues.length) {
      return null;
    }

    return (
      <div>
        {filteredValues.map(parameter => (
          <Fragment key={parameter}>
            <SidebarItem onClick={() => onClick('components', 'parameters', parameter)}>
              <div>
                <SvgIcon icon={IconEnum.indentation} />
              </div>
              <span>
                <Tooltip message={parameters[parameter].description} position="right">
                  {parameter}
                </Tooltip>
              </span>
            </SidebarItem>
          </Fragment>
        ))}
      </div>
    );
  };
/**** ><> ↑ --------- Defines `renderBody` method ->  */

  render() {
    return <SidebarSection title="PARAMETERS" renderBody={this.renderBody} />;
  }
}
/**** ><> ↑ --------- Defines `render` method ->  */
