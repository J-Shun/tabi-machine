import liff from '@line/liff';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    liff.init({ liffId: import.meta.env.VITE_LIFF_ID }).then(() => {
      if (!liff.isLoggedIn()) {
        liff.login();
      }
    });
  }, []);
  return <>123</>;
}

export default App;
