import { useCallback, useRef } from 'react';

import { newSaveSession, requestIdFor } from '../lib/requestId';

export function useSaveSession() {
  const session = useRef(newSaveSession());
  const reset = useCallback(() => {
    session.current = newSaveSession();
  }, []);
  const idFor = useCallback((payload: unknown) => requestIdFor(session.current, payload), []);

  return { reset, idFor };
}
