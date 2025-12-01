const ImgUploadArea = ({
  img,
  onCancel,
  onUpload,
}: {
  img: string | undefined;
  onCancel: () => void;
  onUpload: (imgData: string) => void;
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 檔案大小限制 (500KB)
      const maxSize = 500 * 1024; // 500KB
      if (file.size > maxSize) {
        alert('圖片檔案不能超過 500KB，請選擇較小的圖片或壓縮後再上傳');
        e.target.value = '';
        return;
      }

      // 檔案類型檢查
      if (!file.type.startsWith('image/')) {
        alert('請選擇有效的圖片檔案');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // 建立 canvas 進行壓縮
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // 設定最大尺寸 (更小的尺寸)
          const maxWidth = 600;
          const maxHeight = 600;

          let { width, height } = img;

          // 計算縮放比例
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;

          // 繪製並壓縮圖片 (更高的壓縮率)
          ctx?.drawImage(img, 0, 0, width, height);

          // 轉換為 base64，品質設為 0.6 (更高壓縮)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);

          // 檢查壓縮後的大小
          const base64Size = compressedDataUrl.length * 0.75;
          if (base64Size > 200 * 1024) {
            // 200KB 限制
            alert('圖片經過壓縮後仍然過大，請選擇更小的圖片');
            return;
          }

          onUpload(compressedDataUrl);
        };

        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className='relative'>
      {img && (
        <div className='relative'>
          <img
            src={img}
            alt='封面預覽'
            className='w-full aspect-square object-cover rounded-2xl'
          />
          <button
            type='button'
            onClick={onCancel}
            className='absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70'
          >
            ✕
          </button>
        </div>
      )}

      {!img && (
        <label className='block w-full aspect-square border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all'>
          <div className='flex flex-col items-center justify-center h-full'>
            <span className='text-sm text-gray-600 font-medium'>
              點擊上傳照片
            </span>
            <span className='text-xs text-gray-400 mt-1'>
              建議大小不超過 500KB
            </span>
            <span className='text-xs text-gray-400'>支援 JPG、PNG 格式</span>
          </div>
          <input
            type='file'
            accept='image/jpeg,image/png,image/jpg'
            onChange={handleImageUpload}
            className='hidden'
          />
        </label>
      )}
    </div>
  );
};

export default ImgUploadArea;
