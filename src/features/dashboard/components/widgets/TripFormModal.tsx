import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Trip } from '../../../../types';

interface Props {
  tripData: Trip | null;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSubmit: (trip: Trip) => void;
}

const TripFormModal = ({ tripData, mode, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<Trip>({
    name: tripData?.name || '',
    startDate: tripData?.startDate || '',
    endDate: tripData?.endDate || '',
    country: tripData?.country || '',
    coverImage: tripData?.coverImage || '',
    id: tripData?.id || '',
  });

  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const confirmText = mode === 'create' ? '建立行程' : '更新行程';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.startDate && form.endDate) {
      onSubmit(form);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm({ ...form, coverImage: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // 觸控滑動處理
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaY = e.touches[0].clientY - startY;
    setCurrentY(e.touches[0].clientY);

    // 只允許向下拖拉
    if (deltaY > 0 && modalRef.current) {
      modalRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const deltaY = currentY - startY;
    setIsDragging(false);

    if (!modalRef.current) return;

    // 如果拖拉距離超過 100px，就關閉彈窗，否則回到原位
    if (deltaY > 100) {
      modalRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        onClose();
      }, 200);
    } else {
      modalRef.current.style.transform = 'translateY(0px)';
    }
  };

  // 滑鼠事件處理（桌面端支援）
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaY = e.clientY - startY;
      setCurrentY(e.clientY);

      if (deltaY > 0 && modalRef.current) {
        modalRef.current.style.transform = `translateY(${deltaY}px)`;
      }
    },
    [isDragging, startY]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    const deltaY = currentY - startY;
    setIsDragging(false);

    if (!modalRef.current) return;

    if (deltaY > 100) {
      modalRef.current.style.transform = 'translateY(100%)';
      setTimeout(() => {
        onClose();
      }, 200);
    } else {
      modalRef.current.style.transform = 'translateY(0px)';
    }
  }, [isDragging, currentY, startY, onClose]);

  // 滑鼠事件監聽器
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startY, currentY, handleMouseMove, handleMouseUp]);

  // 背景點擊關閉
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 p-0'
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className='bg-white rounded-t-3xl w-full max-w-md shadow-2xl transition-transform duration-200 ease-out'
        style={{ transform: 'translateY(0px)' }}
      >
        {/* 可拖拉的把手區域 */}
        <div
          className='flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing'
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div className='w-10 h-1 bg-gray-300 rounded-full'></div>
        </div>

        {/* 標題區域 */}
        <div className='px-6 py-4 border-b border-gray-100'>
          <div className='text-center'>
            <div className='text-3xl mb-2'>✈️</div>
            <h2 className='text-xl font-bold text-gray-800 mb-1'>建立新行程</h2>
            <p className='text-sm text-gray-500'>開始規劃你的精彩旅程</p>
          </div>
        </div>

        {/* 表單內容 */}
        <div className='max-h-[60vh] overflow-y-auto'>
          <form onSubmit={handleSubmit} className='p-6 space-y-6'>
            {/* 行程名稱 */}
            <div>
              <div className='flex items-center space-x-2 mb-3'>
                <label className='text-base font-semibold text-gray-800'>
                  行程名稱
                </label>
                <span className='text-red-400'>*</span>
              </div>
              <input
                type='text'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all'
                placeholder='例：東京櫻花之旅'
                required
              />
            </div>

            {/* 旅行日期 */}
            <div>
              <div className='flex items-center space-x-2 mb-3'>
                <label className='text-base font-semibold text-gray-800'>
                  旅行日期
                </label>
                <span className='text-red-400'>*</span>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-sm text-gray-600 mb-2'>
                    出發日
                  </label>
                  <input
                    type='date'
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    className='w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all text-sm'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm text-gray-600 mb-2'>
                    回程日
                  </label>
                  <input
                    type='date'
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    className='w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all text-sm'
                    min={form.startDate}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 目的地國家 */}
            <div>
              <div className='flex items-center space-x-2 mb-3'>
                <label className='text-base font-semibold text-gray-800'>
                  目的地
                </label>
              </div>
              <input
                type='text'
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all'
                placeholder='例：日本'
              />
            </div>

            {/* 封面照片 */}
            <div>
              <div className='flex items-center space-x-2 mb-3'>
                <label className='text-base font-semibold text-gray-800'>
                  封面照片
                </label>
              </div>

              {/* 圖片預覽或上傳區域 */}
              <div className='relative'>
                {form.coverImage && (
                  <div className='relative'>
                    <img
                      src={form.coverImage}
                      alt='封面預覽'
                      className='w-full h-40 object-cover rounded-2xl'
                    />
                    <button
                      type='button'
                      onClick={() => setForm({ ...form, coverImage: '' })}
                      className='absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70'
                    >
                      ✕
                    </button>
                  </div>
                )}

                {!form.coverImage && (
                  <label className='block w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all'>
                    <div className='flex flex-col items-center justify-center h-full'>
                      <span className='text-sm text-gray-600 font-medium'>
                        點擊上傳照片
                      </span>
                      <span className='text-xs text-gray-400 mt-1'>
                        讓行程更有紀念價值
                      </span>
                    </div>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleImageUpload}
                      className='hidden'
                    />
                  </label>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* 底部按鈕 */}
        <div className='p-6 bg-gray-50 rounded-t-2xl border-t border-gray-100'>
          <div className='flex space-x-3'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer'
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.name || !form.startDate || !form.endDate}
              className='flex-1 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripFormModal;
