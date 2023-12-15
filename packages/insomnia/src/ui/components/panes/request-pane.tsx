import React, { FC, useEffect, useState } from 'react';
import { useFetcher, useParams, useRouteLoaderData } from 'react-router-dom';
import styled from 'styled-components';
import { Switch } from '@headlessui/react'

import { getContentTypeFromHeaders } from '../../../common/constants';
import * as models from '../../../models';
import { queryAllWorkspaceUrls } from '../../../models/helpers/query-all-workspace-urls';
import type { Settings } from '../../../models/settings';
import { deconstructQueryStringToParams, extractQueryStringFromUrl } from '../../../utils/url/querystring';
import { useRequestSetter, useSettingsPatcher } from '../../hooks/use-request';
import { useActiveRequestSyncVCSVersion, useGitVCSVersion } from '../../hooks/use-vcs-version';
import { RequestLoaderData } from '../../routes/request';
import { WorkspaceLoaderData } from '../../routes/workspace';
import { PanelContainer, TabItem, Tabs } from '../base/tabs';
import { AuthDropdown } from '../dropdowns/auth-dropdown';
import { ContentTypeDropdown } from '../dropdowns/content-type-dropdown';
import { AuthWrapper } from '../editors/auth/auth-wrapper';
import { BodyEditor } from '../editors/body/body-editor';
import {
  QueryEditor,
  QueryEditorContainer,
  QueryEditorPreview,
} from '../editors/query-editor';
import { RequestHeadersEditor } from '../editors/request-headers-editor';
import { RequestParametersEditor } from '../editors/request-parameters-editor';
import { ErrorBoundary } from '../error-boundary';
import { MarkdownPreview } from '../markdown-preview';
import { RequestSettingsModal } from '../modals/request-settings-modal';
import { RenderedQueryString } from '../rendered-query-string';
import { RequestUrlBar } from '../request-url-bar';
import { Pane, PaneHeader } from './pane';
import { PlaceholderRequestPane } from './placeholder-request-pane';
import { RequestSegmentEditor } from '../editors/request-segment-editor';
import { GitRepoLoaderData } from '../../routes/git-actions';
import { CodeEditor, CodeEditorHandle } from '../codemirror/code-editor';
import { ipcRenderer } from 'electron';
import classNames from 'classnames';
const HeaderContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  height: '100%',
  overflowY: 'auto',
});

export const TabPanelFooter = styled.div({
  boxSizing: 'content-box',
  display: 'flex',
  flexDirection: 'row',
  borderTop: '1px solid var(--hl-md)',
  height: 'var(--line-height-sm)',
  fontSize: 'var(--font-size-sm)',
  '& > button': {
    color: 'var(--hl)',
    padding: 'var(--padding-xs) var(--padding-xs)',
    height: '100%',
  },
});

const TabPanelBody = styled.div({
  overflowY: 'auto',
  flex: '1 0',
});

interface Props {
  environmentId: string;
  settings: Settings;
  setLoading: (l: boolean) => void;
  onPaste: (text: string) => void;
  selectionKey: string | null,
  setSelectionKey: (key: string) => void,

}

export const RequestPane: FC<Props> = ({
  environmentId,
  settings,
  setLoading,
  onPaste,
  frontEndCode,
  selectionKey,
  setSelectionKey
}) => {
  const { activeRequest, activeRequestMeta } = useRouteLoaderData('request/:requestId') as RequestLoaderData;
  const { workspaceId, requestId } = useParams() as { organizationId: string; projectId: string; workspaceId: string; requestId: string };
  const patchSettings = useSettingsPatcher();
  const [isRequestSettingsModalOpen, setIsRequestSettingsModalOpen] =
    useState(false);
  const patchRequest = useRequestSetter();


  const frontEndCodeRef = React.useRef<CodeEditorHandle>(null);

  // useEffect(() => {
  //   if (frontEndCodeRef.current)
  //     frontEndCodeRef.current.setValue(frontEndCode);
  // }, [frontEndCode, selectionKey])


  useEffect(() => {
    if (selectionKey === 'llm') {
      ipcRenderer.send('watchFile', 'ohayo');
    }
  }, [selectionKey])

  const fileContentChangeHandler = (event: any, data: string) => {
    if (frontEndCodeRef.current)
      frontEndCodeRef.current.setValue(data);
  };

  useEffect(() => {
    ipcRenderer.on('file-updated', fileContentChangeHandler)

    return () => {
      ipcRenderer.removeListener('file-updated', fileContentChangeHandler)
    }

  }, [])


  useState(false);
  const handleImportQueryFromUrl = () => {
    let query;

    try {
      query = extractQueryStringFromUrl(activeRequest.url);
    } catch (error) {
      console.warn('Failed to parse url to import querystring');
      return;
    }

    // Remove the search string (?foo=bar&...) from the Url
    const url = activeRequest.url.replace(`?${query}`, '');
    const parameters = [
      ...activeRequest.parameters,
      ...deconstructQueryStringToParams(query),
    ];

    // Only update if url changed
    if (url !== activeRequest.url) {
      patchRequest(requestId, { url, parameters });
    }
  };
  const gitVersion = useGitVCSVersion();

  // const {
  //   activeProject,
  //   activeWorkspace,
  //   gitRepository,
  //   activeWorkspaceMeta,
  // } = useRouteLoaderData(
  //   ':workspaceId'
  // ) as WorkspaceLoaderData;

  // const gitRepoDataFetcher = useFetcher<GitRepoLoaderData>();
  // alert(gitVersion)
  // const { branches, branch: currentBranch } =
  //   gitRepoDataFetcher.data && 'branches' in gitRepoDataFetcher.data
  //     ? gitRepoDataFetcher.data
  //     : { branches: [], branch: '' };

  console.log("gitVersion ->", gitVersion);


  const activeRequestSyncVersion = useActiveRequestSyncVCSVersion();

  const { activeEnvironment } = useRouteLoaderData(
    ':workspaceId',
  ) as WorkspaceLoaderData;
  // Force re-render when we switch requests, the environment gets modified, or the (Git|Sync)VCS version changes
  const uniqueKeyReq = `${activeEnvironment?.modified}::${requestId}::${gitVersion}::${activeRequestSyncVersion}`;

  const uniqueKey = `${uniqueKeyReq}::${activeRequestMeta?.activeResponseId}`;

  if (!activeRequest) {
    return <PlaceholderRequestPane />;
  }

  const numParameters = activeRequest.parameters.filter(
    p => !p.disabled,
  ).length;
  const numHeaders = activeRequest.headers.filter(h => !h.disabled).length;
  const urlHasQueryParameters = activeRequest.url.indexOf('?') >= 0;
  const contentType =
    getContentTypeFromHeaders(activeRequest.headers) ||
    activeRequest.body.mimeType;
  return (
    <Pane type="request">

      <PaneHeader >
        <ErrorBoundary errorClassName="font-error pad text-center">
          <RequestUrlBar
            key={requestId}
            uniquenessKey={uniqueKeyReq}
            handleAutocompleteUrls={() => queryAllWorkspaceUrls(workspaceId, models.request.type, requestId)}
            nunjucksPowerUserMode={settings.nunjucksPowerUserMode}
            setLoading={setLoading}
            onPaste={onPaste}
            setIsRequestSettingsModalOpen={setIsRequestSettingsModalOpen}
          />
        </ErrorBoundary>
      </PaneHeader>
      <Tabs aria-label="Request pane tabs"
        onSelectionChange={(key: any) => {
          setSelectionKey(key)
        }}
        selectedKey={selectionKey}
      >
        <TabItem key="content-type" title={<ContentTypeDropdown />}>
          <BodyEditor
            key={uniqueKey}
            request={activeRequest}
            environmentId={environmentId}
          />
        </TabItem>
        <TabItem key="auth" title={<AuthDropdown />}>
          <ErrorBoundary
            key={uniqueKey}
            errorClassName="font-error pad text-center"
          >
            <AuthWrapper />
          </ErrorBoundary>
        </TabItem>
        <TabItem
          key="query"
          title={
            <>
              Query{' '}
              {numParameters > 0 && (
                <span className="bubble space-left">{numParameters}</span>
              )}
            </>
          }
        >
          <QueryEditorContainer>
            <QueryEditorPreview className="pad pad-bottom-sm">
              <label className="label--small no-pad-top">Url Preview</label>
              <code className="txt-sm block faint">
                <ErrorBoundary
                  key={uniqueKey}
                  errorClassName="tall wide vertically-align font-error pad text-center"
                >
                  <RenderedQueryString request={activeRequest} />
                </ErrorBoundary>
              </code>
            </QueryEditorPreview>
            <QueryEditor>
              <ErrorBoundary
                key={uniqueKey}
                errorClassName="tall wide vertically-align font-error pad text-center"
              >
                <RequestParametersEditor
                  key={contentType}
                  bulk={settings.useBulkParametersEditor}
                />

                <br />
                <RequestSegmentEditor
                  key={contentType + "segment"}
                  bulk={settings.useBulkParametersEditor}
                />
              </ErrorBoundary>
            </QueryEditor>
            <TabPanelFooter>
              <button
                className="btn btn--compact"
                title={
                  urlHasQueryParameters
                    ? 'Import querystring'
                    : 'No query params to import'
                }
                onClick={handleImportQueryFromUrl}
              >
                Import from URL
              </button>
              <button
                className="btn btn--compact"
                onClick={() =>
                  patchSettings({
                    useBulkParametersEditor: !settings.useBulkParametersEditor,
                  })
                }
              >
                {settings.useBulkParametersEditor
                  ? 'Regular Edit'
                  : 'Bulk Edit'}
              </button>
            </TabPanelFooter>
          </QueryEditorContainer>
        </TabItem>
        <TabItem
          key="headers"
          title={
            <>
              Headers{' '}
              {numHeaders > 0 && (
                <span className="bubble space-left">{numHeaders}</span>
              )}
            </>
          }
        >
          <HeaderContainer>
            <ErrorBoundary
              key={uniqueKey}
              errorClassName="font-error pad text-center"
            >
              <TabPanelBody>
                <RequestHeadersEditor bulk={settings.useBulkHeaderEditor} />
              </TabPanelBody>
            </ErrorBoundary>

            <TabPanelFooter>
              <button
                className="btn btn--compact"
                onClick={() =>
                  patchSettings({
                    useBulkHeaderEditor: !settings.useBulkHeaderEditor,
                  })
                }
              >
                {settings.useBulkHeaderEditor ? 'Regular Edit' : 'Bulk Edit'}
              </button>
            </TabPanelFooter>
          </HeaderContainer>
        </TabItem>

        <TabItem

          key="llm"
          title={
            <>
              ArchGPT
            </>
          }
        >
          <PanelContainer className="tall">
            <div className='bg-black text-white mb-2'>
              <div className='pt-4 pl-4 flex items-center justify-between pr-4'>
                <div className=''>Intention:</div>

                <Switch.Group as="div" className="flex items-center">
                  <Switch
                    checked={true}
                    onChange={() => { }}
                    className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                  >
                    <span className="sr-only">Infer from names and other files</span>
                    <span aria-hidden="true" className="pointer-events-none absolute h-full w-full rounded-md" />
                    <span
                      aria-hidden="true"
                      className={classNames(
                        true ? 'bg-indigo-600' : 'bg-gray-200',
                        'pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out'
                      )}
                    />
                    <span
                      aria-hidden="true"
                      className={classNames(
                        true ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out'
                      )}
                    />
                  </Switch>
                  <Switch.Label as="span" className="ml-3 text-sm">
                    <span className="font-medium">Infer intention from files and names</span>{' '}

                  </Switch.Label>
                </Switch.Group>


              </div>
              <textarea
                autoComplete="off"
                defaultValue="hello"
                className='bg-black text-base-content w-full h-24 p-4'
              />
            </div>
            <div className='theme--pane__header'>
              <Tabs aria-label="ArchGPT pane tabs"
              // onSelectionChange={(key: any) => {
              //   setSelectionKey(key)
              // }}
              // selectedKey={selectionKey}

              >
                <TabItem key="front-end" title={"Front-End UI"}>
                  <div className='px-4 mt-2 flex flex-wrap items-center gap-2'>
                    <div>write LLM result into: <u>./request5/ui.htmx</u>
                    </div>

                    <div className="flex items-center space-x-1">

                      <div >
                        <button className='llm-button' onClick={async () => {

                        }}>🐕 gen UI for input</button>
                      </div>
                      <div >
                        <button className='llm-button' onClick={async () => {

                        }}>🐕 gen UI for result JSON</button>
                      </div>
                      <div className='llm-button'> <i className="fa fa-gear" /></div>
                    </div>
                  </div>
                </TabItem>
                <TabItem key="filter" title={"JSON Filter"}>
                  <div className="flex items-center space-x-1 mt-2">
                    <div className='px-4'>write LLM result into: <u>./request5/filter.ts</u>
                    </div>
                    <div className='theme--pane__header'>
                      <button className='llm-button' onClick={async () => {

                      }}>🐕 gen filter</button>
                    </div>
                    <div className='llm-button'>   <i className="fa fa-gear" /></div>
                  </div>
                </TabItem>
                {/* <TabItem key="test-case" title={"test cases"}>
                  <div className="flex items-center space-x-1 mt-2">
                    <div className='px-4'>stream LLM result into: "./request5/tests.tsx"
                    </div>
                    <div className='theme--pane__header'>
                      <button className='llm-button' onClick={async () => {

                      }}>🐕 send and run LLM</button>
                    </div>
                  </div>
                </TabItem> */}
              </Tabs>
            </div>

            <CodeEditor
              className='mt-2 px-4'
              id="markdown-editor"
              ref={frontEndCodeRef}
              hideGutters
              hideLineNumbers
              dynamicHeight={''}
              showPrettifyButton
              noStyleActiveLine
              enableNunjucks
              mode={''}
              defaultValue='_'
            // placeholder={placeholder}
            // defaultValue={markdown}
            // onChange={handleChange}
            />
            <div>

            </div>
          </PanelContainer >
        </TabItem >
      </Tabs >

      {isRequestSettingsModalOpen && (
        <RequestSettingsModal
          request={activeRequest}
          onHide={() => setIsRequestSettingsModalOpen(false)}
        />
      )}
    </Pane >
  );
};




// <PanelContainer className="tall">
//             {activeRequest.description ? (
//               <div>
//                 <div className="pull-right pad bg-default">
//                   <button
//                     className="btn btn--clicky"
//                     onClick={() => setIsRequestSettingsModalOpen(true)}
//                   >
//                     Edit
//                   </button>
//                 </div>
//                 <div className="pad">
//                   <ErrorBoundary errorClassName="font-error pad text-center">
//                     <MarkdownPreview
//                       heading={activeRequest.name}
//                       markdown={activeRequest.description}
//                     />
//                   </ErrorBoundary>
//                 </div>
//               </div>
//             ) : (
//               <div className="overflow-hidden editor vertically-center text-center">
//                 <p className="pad text-sm text-center">
//                   <span className="super-faint">
//                     <i
//                       className="fa fa-file-text-o"
//                       style={{
//                         fontSize: '8rem',
//                         opacity: 0.3,
//                       }}
//                     />
//                   </span>
//                   <br />
//                   <br />
//                   <button
//                     className="btn btn--clicky faint"
//                     onClick={() => setIsRequestSettingsModalOpen(true)}
//                   >
//                     Add Description
//                   </button>
//                 </p>
//               </div>
//             )}
//           </PanelContainer>
