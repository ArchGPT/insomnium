import React, { useEffect, useRef, useState } from 'react';
import { OverlayContainer } from 'react-aria';
import { useFetcher, useParams, useRouteLoaderData } from 'react-router-dom';

import { fuzzyMatch } from '../../../common/misc';
import type { Cookie, CookieJar } from '../../../models/cookie-jar';
import { useNunjucks } from '../../context/nunjucks/use-nunjucks';
import { WorkspaceLoaderData } from '../../routes/workspace';
import { Modal, type ModalHandle, ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalFooter } from '../base/modal-footer';
import { ModalHeader } from '../base/modal-header';
import { CookieList } from '../cookie-list';
/**** ><> ↑ --------- Importing modules from both npm and local sources. -> This segment is mostly for importing different packages necessary for this file to work. It contains various imports from npm packages (like 'react', 'react-aria', and 'react-router-dom') as well as local modules. */

export const CookiesModal = ({ onHide }: ModalProps) => {
  const modalRef = useRef<ModalHandle>(null);
  const { handleRender } = useNunjucks();
  const [filter, setFilter] = useState<string>('');
  const [visibleCookieIndexes, setVisibleCookieIndexes] = useState<number[] | null>(null);
  const { activeCookieJar } = useRouteLoaderData(':workspaceId') as WorkspaceLoaderData;
  const { organizationId, projectId, workspaceId } = useParams<{ organizationId: string; projectId: string; workspaceId: string }>();
  const updateCookieJarFetcher = useFetcher<CookieJar>();
  useEffect(() => {
/**** ><> ↑ --------- Creating the CookiesModal component and setting up state and various hooks. -> Defines the CookiesModal component and sets up state using the useState Hook. It also sets up various hooks for fetching data and acting on updates to the data. */
    modalRef.current?.show();
  }, []);

  const updateCookieJar = async (cookieJarId: string, patch: CookieJar) => {
    updateCookieJarFetcher.submit(JSON.stringify({ patch, cookieJarId }), {
      encType: 'application/json',
      method: 'post',
      action: `/organization/${organizationId}/project/${projectId}/workspace/${workspaceId}/cookieJar/update`,
    });
  };
/**** ><> ↑ --------- Update CookieJar function definition. -> This segment defines a function 'updateCookieJar' that presumably updates a cookieJar by POST-ing data to an API endpoint. */
  const filteredCookies = visibleCookieIndexes ? (activeCookieJar?.cookies || []).filter((_, i) => visibleCookieIndexes.includes(i)) : (activeCookieJar?.cookies || []);
/**** ><> ↑ --------- Filtering visible cookies -> This line takes care of providing a filtered cookies list based on their visibility status. */
  return (
    <OverlayContainer>
      <Modal ref={modalRef} wide tall onHide={onHide}>
        <ModalHeader>Manage Cookies</ModalHeader>
        <ModalBody noScroll>
          {activeCookieJar && (
            <div className="cookie-list">
              <div className="pad">
                <div className="form-control form-control--outlined">
                  <label>
                    Filter Cookies
                    <input
                      onChange={async event => {
                        setFilter(event.target.value);
                        const renderedCookies: Cookie[] = [];
                        for (const cookie of (activeCookieJar?.cookies || [])) {
                          try {
                            renderedCookies.push(await handleRender(cookie));
                          } catch (err) {
                            renderedCookies.push(cookie);
                          }
                        }
                        if (!filter) {
                          setVisibleCookieIndexes(null);
                        }
                        const visibleCookieIndexes: number[] = [];
                        renderedCookies.forEach((cookie, i) => {
                          if (fuzzyMatch(filter, JSON.stringify(cookie), { splitSpace: true })) {
                            visibleCookieIndexes.push(i);
                          }
                        });
                        setVisibleCookieIndexes(visibleCookieIndexes);
                      }}
                      type="text"
                      placeholder="insomnia.rest"
                      defaultValue=""
                    />
                  </label>
                </div>
              </div>
              <div className="cookie-list__list border-tops pad">
                <CookieList
                  cookies={filteredCookies}
                  handleDeleteAll={() => {
                    const updated = activeCookieJar;
                    updated.cookies = [];
                    updateCookieJar(activeCookieJar._id, updated);
                  }}
                  handleCookieAdd={cookie => {
                    const updated = activeCookieJar;
                    updated.cookies = [cookie, ...activeCookieJar.cookies];
                    updateCookieJar(activeCookieJar._id, updated);
                  }}
                  handleCookieDelete={cookie => {
                    const updated = activeCookieJar;
                    updated.cookies = activeCookieJar.cookies.filter(c => c.id !== cookie.id);
                    updateCookieJar(activeCookieJar._id, updated);
                  }}
                  // Set the domain to the filter so that it shows up if we're filtering
                  newCookieDomainName={filter || 'domain.com'}
                />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="margin-left faint italic txt-sm">
            * cookies are automatically sent with relevant requests
          </div>
          <button className="btn" onClick={() => modalRef.current?.hide()}>
            Done
          </button>
        </ModalFooter>
      </Modal>
    </OverlayContainer>
  );
};
/**** ><> ↑ --------- Rendering the CookiesModal component -> This segment contains all the JSX code necessary to render the CookiesModal component and its children, including event handlers and nested components like OverlayContainer, Modal, ModalHeader, ModalBody, and ModalFooter. */
