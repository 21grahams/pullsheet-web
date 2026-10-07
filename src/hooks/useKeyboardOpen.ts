import { useEffect, useState } from 'react';

/** True while the on-screen keyboard is up (the visible area shrinks well below the window). */
export function useKeyboardOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setOpen(window.innerHeight - vv.height > 150);
    vv.addEventListener('resize', update);

    return () => vv.removeEventListener('resize', update);
  }, []);

  return open;
}
