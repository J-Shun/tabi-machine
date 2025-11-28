const FloatButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className='fixed bottom-6 right-6 z-20'>
      <button
        className='w-14 h-14 bg-blue-500 hover:bg-blue-600 active:scale-95 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer'
        onClick={onClick}
      >
        <span className='text-white text-2xl font-bold'>+</span>
      </button>
    </div>
  );
};

export default FloatButton;
