const Loading = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
        <div className='text-gray-600'>載入中...</div>
      </div>
    </div>
  );
};

export default Loading;
