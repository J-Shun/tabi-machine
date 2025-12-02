import { useState } from 'react';

const ImgUploadArea = ({
  img,
  onCancel,
  onUpload,
}: {
  img: string | undefined;
  onCancel: () => void;
  onUpload: (imgData: string) => void;
}) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isUrlError, setIsUrlError] = useState(false);

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

  const deletePreview = () => {
    onCancel();
    setShowUrlInput(false);
    setUrlInput('');
    setIsUrlError(false);
  };

  const handleUrlSubmit = () => {
    // 驗證：必須是網址
    if (!urlInput || !/^https?:\/\/.+/.test(urlInput)) {
      alert('請輸入有效的圖片網址');
      return;
    }
    onUpload(urlInput);
    setShowUrlInput(false);
    setUrlInput('');
  };

  return (
    <div className='relative'>
      {img && (
        <div className='relative'>
          {!isUrlError && (
            <img
              src={img}
              alt='封面預覽'
              className='w-full aspect-square object-cover rounded-2xl'
              onError={() => {
                setIsUrlError(true);
              }}
            />
          )}
          {isUrlError && (
            <div className='w-full aspect-square flex items-center justify-center bg-gray-100 rounded-2xl'>
              <span className='text-gray-500'>圖片網址失效或連結錯誤</span>
            </div>
          )}
          <button
            type='button'
            onClick={deletePreview}
            className='absolute top-2 right-2 w-8 h-8 cursor-pointer bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70'
          >
            ✕
          </button>
        </div>
      )}

      {!img && !showUrlInput && (
        <div className='block w-full aspect-square border-2 border-dashed border-gray-300 rounded-2xl'>
          <div className='flex flex-col items-center justify-center h-full space-y-4'>
            <div className='text-center mb-2'>
              <span className='text-sm text-gray-600 font-medium block'>
                上傳照片（選填）
              </span>
              <span className='text-xs text-gray-400 mt-1 block'>
                建議大小不超過 500KB
              </span>
              <span className='text-xs text-gray-400'>支援 JPG、PNG 格式</span>
            </div>

            <div className='flex flex-col space-y-3 w-full max-w-xs px-4'>
              <label className='py-2.5 px-5 rounded-lg cursor-pointer text-gray-600 border-2 border-dashed border-gray-300 text-center text-sm font-medium'>
                選擇本地檔案
                <input
                  type='file'
                  accept='image/jpeg,image/png,image/jpg'
                  onChange={handleImageUpload}
                  className='hidden'
                />
              </label>

              <button
                onClick={() => setShowUrlInput(true)}
                className='py-2.5 px-5 rounded-lg cursor-pointer text-gray-600 border-2 border-dashed border-gray-300 text-sm font-medium'
              >
                輸入圖片網址
              </button>
            </div>
          </div>
        </div>
      )}

      {!img && showUrlInput && (
        <div className='block w-full aspect-square border-2 border-dashed border-gray-300 rounded-2xl'>
          <div className='flex flex-col items-center justify-center h-full space-y-4 p-6'>
            <div className='text-center'>
              <span className='text-sm text-gray-600 font-medium block'>
                輸入圖片網址
              </span>
              <span className='text-xs text-gray-400 mt-1'>
                支援 JPG、PNG、GIF、WebP 格式
              </span>
            </div>

            <div className='w-full max-w-sm space-y-3'>
              <input
                type='url'
                placeholder='https://example.com/image.jpg'
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
              />

              <div className='flex space-x-2'>
                <button
                  onClick={() => {
                    setShowUrlInput(false);
                    setUrlInput('');
                  }}
                  className='flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-500 transition-colors text-sm font-medium'
                >
                  取消
                </button>

                <button
                  onClick={handleUrlSubmit}
                  className='flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors text-sm font-medium'
                >
                  確認
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImgUploadArea;
