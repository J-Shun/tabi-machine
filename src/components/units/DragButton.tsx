const DragButton = () => {
  return (
    <button className='p-2 text-gray-400 active:text-gray-600 transition-colors cursor-pointer'>
      <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor'>
        <circle cx='3' cy='4' r='1' />
        <circle cx='3' cy='8' r='1' />
        <circle cx='3' cy='12' r='1' />
        <circle cx='8' cy='4' r='1' />
        <circle cx='8' cy='8' r='1' />
        <circle cx='8' cy='12' r='1' />
      </svg>
    </button>
  );
};

export default DragButton;
