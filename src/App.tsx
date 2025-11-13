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
  return <div className='bg-red-500'>123</div>;
}

export default App;
