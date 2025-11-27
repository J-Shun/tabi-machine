const DeleteButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void;
}) => {
  return (
    <button
      onClick={onClick}
      className='group w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 cursor-pointer'
    >
      <svg
        className='w-4 h-4 text-gray-600 group-hover:text-red-600'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M6 18L18 6M6 6l12 12'
        />
      </svg>
    </button>
  );
};

export default DeleteButton;
