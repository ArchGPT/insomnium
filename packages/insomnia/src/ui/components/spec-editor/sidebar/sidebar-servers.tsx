import React, { Component, Fragment, ReactNode } from 'react';

import { IconEnum, SvgIcon } from '../../svg-icon';
import { SidebarInvalidSection } from './sidebar-invalid-section';
import { SidebarItem } from './sidebar-item';
import { SidebarSection } from './sidebar-section';
/**** ><> ↑ --------- Import statements ->  */

export interface SidebarServer {
  url: string;
}
/**** ><> ↑ --------- SidebarServer interface definition ->  */

export interface SidebarServersProps {
  servers: SidebarServer[];
  onClick: (section: string, path: string | number) => void;
}
/**** ><> ↑ --------- SidebarServersProps interface definition ->  */

// Implemented as a class component because of a caveat with render props
// https://reactjs.org/docs/render-props.html#be-careful-when-using-render-props-with-reactpurecomponent
/**** ><> ↑ --------- Explanation about the use of class component ->  */
export class SidebarServers extends Component<SidebarServersProps> {
  renderBody = (filter: string): null | ReactNode => {
/**** ><> ↑ --------- SidebarServers class declaration and beginning of definition ->  */
    const { servers, onClick } = this.props;

    if (!Array.isArray(servers)) {
      return <SidebarInvalidSection name={'server'} />;
    }
/**** ><> ↑ --------- Code segment to handle non-array servers ->  */

    const filteredValues = servers.filter(server =>
      server.url.includes(filter.toLocaleLowerCase()),
    );

/**** ><> ↑ --------- Code to filter servers ->  */
    if (!filteredValues.length) {
      return null;
    }
/**** ><> ↑ --------- Code to handle absence of filtered servers ->  */

    return (
      <div>
        {filteredValues.map((server, index) => (
          <Fragment key={server.url}>
            <SidebarItem onClick={() => onClick('servers', index)}>
              <div>
                <SvgIcon icon={IconEnum.indentation} />
              </div>
              <span>{server.url}</span>
            </SidebarItem>
          </Fragment>
        ))}
      </div>
    );
/**** ><> ↑ --------- Code to return a JSX of filtered server list ->  */
  };

  render() {
    return <SidebarSection title="SERVERS" renderBody={this.renderBody} />;
  }
}
/**** ><> ↑ --------- Render method of SidebarServers class ->  */
