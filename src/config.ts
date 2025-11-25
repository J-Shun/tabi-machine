const isLocal = import.meta.env.MODE === 'development';

const config = {
  LIFF_ID: isLocal ? '2008473114-AZxEO3Zn' : import.meta.env.VITE_LIFF_ID,
};

export default config;
