import { useEffect, useState } from 'react';
import { useInterval } from 'react-use';

import { CurlEvent } from '../../main/network/curl';
import { WebSocketEvent } from '../../main/network/websocket';

/**** ><> ↑ --------- Import statements ->  */
export function useRealtimeConnectionEvents({ responseId, protocol }: { responseId: string; protocol: 'curl' | 'webSocket' }) {
  const [events, setEvents] = useState<CurlEvent[] | WebSocketEvent[]>([]);

  useEffect(() => {
    setEvents([]);
  }, [responseId]);
/**** ><> ↑ --------- useEffect hook ->  */

  useInterval(
    () => {
      let isMounted = true;
      const fn = async () => {
        const allEvents = await window.main[protocol].event.findMany({ responseId });
        if (isMounted) {
          setEvents(allEvents);
        }
      };
      fn();
      return () => {
        isMounted = false;
      };
    },
    500
  );
/**** ><> ↑ --------- useInterval hook ->  */

  return events;
/**** ><> ↑ --------- Return statement ->  */
/**** ><> ↑ --------- useRealtimeConnectionEvents function definition ->  */
}
/**** ><> ↑ --------- Function exit ->  */
