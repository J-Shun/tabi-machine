const GoBackButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className='mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer'
    >
      <span className='text-xl'>←</span>
    </button>
  );
};

export default GoBackButton;
