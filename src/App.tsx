import liff from '@line/liff';
import { useEffect } from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';

import config from './config';

const router = createRouter({ routeTree });

// TanStack Router 型別安全的起手式

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const TouchOrHTML5Backend = isTouchDevice ? TouchBackend : HTML5Backend;

  useEffect(() => {
    liff.init({ liffId: config.LIFF_ID }).then(() => {
      if (!liff.isLoggedIn()) {
        liff.login();
      }
    });
  }, []);

  return (
    <DndProvider backend={TouchOrHTML5Backend}>
      <RouterProvider router={router} />
    </DndProvider>
  );
}

export default App;
