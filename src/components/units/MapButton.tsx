const MapButton = ({ location }: { location: string }) => {
  const handleClick = (e: React.MouseEvent, location: string) => {
    if (!location) return;
    e.stopPropagation();
    const query = encodeURIComponent(location);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  const locationName = location || '無地圖位置';

  return (
    <button
      className={`inline-flex items-center space-x-2 text-sm bg-gray-50 py-2 rounded-lg transition-all w-full text-left cursor-pointer group ${
        location ? 'text-gray-600' : 'text-gray-400 pointer-events-none'
      }`}
      onClick={(e) => handleClick(e, location)}
    >
      <svg
        className='w-4 h-4 group-hover:text-blue-500 group-active:text-blue-600 transition-colors'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14'
        />
      </svg>
      <span className='font-medium flex-1 group-hover:text-gray-800 group-active:text-gray-900 transition-colors'>
        {locationName}
      </span>
    </button>
  );
};

export default MapButton;
