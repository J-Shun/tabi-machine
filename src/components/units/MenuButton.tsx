const MenuButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void;
}) => {
  return (
    <button
      onClick={onClick}
      className='w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer'
    >
      <div className='flex flex-col space-y-0.5'>
        <div className='w-1 h-1 bg-gray-600 rounded-full'></div>
        <div className='w-1 h-1 bg-gray-600 rounded-full'></div>
        <div className='w-1 h-1 bg-gray-600 rounded-full'></div>
      </div>
    </button>
  );
};

export default MenuButton;
