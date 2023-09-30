import React, { forwardRef, Key, useImperativeHandle, useRef, useState } from 'react';
import YAML from 'yaml';

import { parseApiSpec } from '../../../common/api-specs';
import type { ApiSpec } from '../../../models/api-spec';
import { CopyButton } from '../base/copy-button';
import { Link } from '../base/link';
import { Modal, type ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalFooter } from '../base/modal-footer';
import { ModalHeader } from '../base/modal-header';
import { PanelContainer, TabItem, Tabs } from '../base/tabs';
import { CodeEditor } from '../codemirror/code-editor';
import { HelpTooltip } from '../help-tooltip';
import { showModal } from './index';
/**** ><> ↑ --------- Library and local imports -> These lines are importing necessary libraries and components from local directories for use in the code. */

interface Config {
  label: string;
  docsLink?: string;
  content: string;
  mimeType: string;
  error: string | null;
}

interface State {
  configs: Config[];
  activeTab: number;
}

interface GenerateConfigModalOptions {
  apiSpec: ApiSpec;
  activeTabLabel: string;
}

export const configGenerators = [{
  label: 'Declarative Config (Kong 3.x)',
  docsLink: 'https://docs.insomnia.rest/insomnia/declarative-config',
},
{
  label: 'Declarative Config (Legacy)',
  docsLink: 'https://docs.insomnia.rest/insomnia/declarative-config',
},
{
  label: 'Kong for Kubernetes',
  docsLink: 'https://docs.insomnia.rest/insomnia/kong-for-kubernetes',
}];
export interface GenerateConfigModalHandle {
  show: (options: GenerateConfigModalOptions) => void;
  hide: () => void;
}
/**** ><> ↑ --------- Interfaces and Config Generators -> These lines are defining several interfaces and establishing user specified configurations for future use. */
export const GenerateConfigModal = forwardRef<GenerateConfigModalHandle, ModalProps>((_, ref) => {
  const modalRef = useRef<ModalHandle>(null);
  const [state, setState] = useState<State>({
    configs: [],
    activeTab: 0,
  });

  useImperativeHandle(ref, () => ({
    hide: () => {
      modalRef.current?.hide();
    },
    show: async options => {
      const configs: Config[] = [];
      for (const p of configGenerators) {
        configs.push(await generateConfig(p, options.apiSpec));
      }
      const foundIndex = configs.findIndex(c => c.label === options.activeTabLabel);
      setState({
        configs,
        activeTab: foundIndex < 0 ? 0 : foundIndex,
      });
      modalRef.current?.show();
    },
  }), []);

/**** ><> ↑ --------- GenerateConfigModal Component body and state handling -> This partition involves the creation of a GenerateConfigModal component and the use of state in it. It mainly deals with showing and hiding modals and setting state. */
  const generateConfig = async (generatePlugin: typeof configGenerators[0], apiSpec: ApiSpec): Promise<Config> => {
    try {
      const { rawContents, formatVersion } = parseApiSpec(apiSpec.contents);
      const isSupported = formatVersion && formatVersion.match(/^3./);
      if (!isSupported) {
        return {
          content: '',
          mimeType: 'text/yaml',
          label: generatePlugin.label,
          docsLink: generatePlugin.docsLink,
          error: `Unsupported OpenAPI spec format ${formatVersion}`,
        };
      }
      throw "openapi-2-kong removed"

    } catch (err) {
      return {
        content: '',
        mimeType: 'text/yaml',
        label: generatePlugin.label,
        docsLink: generatePlugin.docsLink,
        error: err.message,
      };
    }
  };
/**** ><> ↑ --------- generateConfig Function -> This block is a function that generates a configuration document according to the input API spec, format version and whether the version is supported or not. */

  const onSelect = (key: Key) => {
    setState({
      configs,
      activeTab: configs.findIndex(c => c.label === key),
    });
  };
  const { configs, activeTab } = state;
  const activeConfig = configs[activeTab];
  return (
    <Modal ref={modalRef} tall>
      <ModalHeader>Generate Config</ModalHeader>
      <ModalBody className="wide">
        <div className="notice warning">
          <p>
            Kong config generation has been moved to decK CLI, <Link href={'https://github.com/Kong/deck'}>https://github.com/Kong/deck</Link>.
          </p>
        </div>
        <Tabs
          aria-label="General configuration tabs"
          defaultSelectedKey={activeTab}
          onSelectionChange={onSelect}
        >
          {configs.map(config =>
          (<TabItem
            key={config.label}
            title={
              <>
                {config.label}
                {config.docsLink ?
                  <>
                    {' '}
                    <HelpTooltip>
                      To learn more about {config.label}
                      <br />
                      <Link href={config.docsLink}>Documentation {<i className="fa fa-external-link-square" />}</Link>
                    </HelpTooltip>
                  </> : null}
              </>
            }
          >
            <PanelContainer key={config.label}>
              {config.error ?
                <p className="notice error margin-md">
                  {config.error}
                  {config.docsLink ? <><br /><Link href={config.docsLink}>Documentation {<i className="fa fa-external-link-square" />}</Link></> : null}
                </p> :
                <CodeEditor
                  id="generate-config-modal"
                  className="tall pad-top-sm"
                  defaultValue={config.content}
                  mode={config.mimeType}
                  readOnly
                />}
            </PanelContainer>
          </TabItem>)
          )}
        </Tabs>
/**** ><> ↑ --------- Tabs selection and Config View -> Reflects the selection of tabs in the state and rendering the configuration viewers according to selected tab. */
      </ModalBody>
      {activeConfig && (
        <ModalFooter>
          <CopyButton className="btn" content={activeConfig.content}>
            Copy to Clipboard
          </CopyButton>
        </ModalFooter>
      )}
/**** ><> ↑ --------- Modal Footer -> Setting up the Modal Footer to enable copy to clipboard functionality. */
    </Modal>
  );
});
GenerateConfigModal.displayName = 'GenerateConfigModal';

export const showGenerateConfigModal = (opts: GenerateConfigModalOptions) => showModal(GenerateConfigModal, opts);
/**** ><> ↑ --------- Component export -> This block assigns a display name and exports the GenerateConfigModal component and the function to show the modal. */
