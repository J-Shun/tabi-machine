import liff from '@line/liff';
import { useEffect } from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import config from './config';

const router = createRouter({ routeTree });

// TanStack Router 型別安全的起手式

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  useEffect(() => {
    liff.init({ liffId: config.LIFF_ID }).then(() => {
      if (!liff.isLoggedIn()) {
        liff.login();
      }
    });
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
