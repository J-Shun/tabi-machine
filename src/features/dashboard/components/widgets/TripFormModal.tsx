import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

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
    coverImage: tripData?.coverImage || '',
    id: tripData?.id || '',
  });

  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const confirmText = mode === 'create' ? '建立行程' : '更新行程';

  // 格式化日期顯示
  const formatDateDisplay = (startDate: string, endDate: string) => {
    if (!startDate && !endDate) {
      return '請選擇旅行日期';
    }

    if (startDate && !endDate) {
      return `${new Date(startDate).toLocaleDateString('zh-TW')} - 請選擇結束日期`;
    }

    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString('zh-TW');
      const end = new Date(endDate).toLocaleDateString('zh-TW');
      const days =
        Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      return `${start} - ${end} (${days} 天)`;
    }

    return '請選擇旅行日期';
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // 處理日期選擇
  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    // 沒有開始日期就設定開始日期
    if (!form.startDate && range?.from) {
      const formatted = formatDate(range.from);
      setForm((prev) => ({
        ...prev,
        startDate: formatted,
      }));
    }

    // 如果有開始日期，但是設定日期早於開始日期，就更新開始日期
    else if (
      form.startDate &&
      range?.from &&
      new Date(formatDate(range.from)) <
        new Date(form.startDate.replace(/-/g, '/'))
    ) {
      const formatted = formatDate(range.from);
      setForm((prev) => ({
        ...prev,
        startDate: formatted,
      }));
    }

    // 有開始日期但沒有結束日期就設定結束日期
    else if (form.startDate && !form.endDate && range?.to) {
      const formatted = formatDate(range.to);
      setForm((prev) => ({
        ...prev,
        endDate: formatted,
      }));
      setShowDatePicker(false);
    }
  };

  // 點擊日期顯示框
  const handleDateDisplayClick = () => {
    // 重置為從開始日期選擇
    setForm((prev) => ({
      ...prev,
      startDate: '',
      endDate: '',
    }));
    setShowDatePicker(!showDatePicker);
  };

  // 關閉動畫處理
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setIsVisible(false);
    if (modalRef.current) {
      modalRef.current.style.transform = 'translateY(100%)';
    }
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.startDate && form.endDate) {
      onSubmit(form);
      handleClose();
    }
  };

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

          setForm({ ...form, coverImage: compressedDataUrl });
        };

        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // 觸控滑動處理
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isClosing) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isClosing) return;

    const deltaY = e.touches[0].clientY - startY;
    setCurrentY(e.touches[0].clientY);

    // 只允許向下拖拉
    if (deltaY > 0 && modalRef.current) {
      modalRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || isClosing) return;

    const deltaY = currentY - startY;
    setIsDragging(false);

    if (!modalRef.current) return;

    // 如果拖拉距離超過 100px，就關閉彈窗，否則回到原位
    if (deltaY > 100) {
      handleClose();
    } else {
      modalRef.current.style.transform = 'translateY(0px)';
    }
  };

  // 滑鼠事件處理（桌面端支援）
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isClosing) return;
    setIsDragging(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || isClosing) return;

      const deltaY = e.clientY - startY;
      setCurrentY(e.clientY);

      if (deltaY > 0 && modalRef.current) {
        modalRef.current.style.transform = `translateY(${deltaY}px)`;
      }
    },
    [isDragging, startY, isClosing]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging || isClosing) return;

    const deltaY = currentY - startY;
    setIsDragging(false);

    if (!modalRef.current) return;

    if (deltaY > 100) {
      handleClose();
    } else {
      modalRef.current.style.transform = 'translateY(0px)';
    }
  }, [isDragging, isClosing, currentY, startY, handleClose]);

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
    if (e.target === e.currentTarget && !isClosing) {
      handleClose();
    }
  };

  // 入場動畫
  useEffect(() => {
    // 元件載入後立即觸發背景動畫
    setIsVisible(true);

    if (modalRef.current && !isClosing) {
      modalRef.current.style.transform = 'translateY(100%)';
      requestAnimationFrame(() => {
        if (modalRef.current) {
          modalRef.current.style.transform = 'translateY(0px)';
        }
      });
    }
  }, [isClosing]);

  // 點擊外部關閉日期選擇器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDatePicker &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center z-50 p-0 transition-all duration-300 ease-out ${
        isVisible
          ? 'bg-black/60 backdrop-blur-sm'
          : 'bg-black/0 backdrop-blur-none'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className='bg-white rounded-t-3xl w-full max-w-md shadow-2xl transition-transform duration-300 ease-out'
        style={{ transform: 'translateY(100%)' }}
      >
        {/* 可拖拉的把手區域 */}
        <div
          className='flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing'
          style={{ touchAction: 'none' }} // 禁用所有觸控手勢
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
            <h2 className='text-xl font-bold text-gray-800 mb-1'>
              {mode === 'create' ? '建立新行程' : '編輯行程'}
            </h2>
            <p className='text-sm text-gray-500'>
              {mode === 'create' ? '開始規劃你的精彩旅程' : '修改你的旅程規劃'}
            </p>
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
                className='w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all'
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

              {/* 日期顯示框 */}
              <div
                onClick={handleDateDisplayClick}
                className={`w-full px-4 py-3 border border-gray-200 rounded-2xl cursor-pointer transition-all ${showDatePicker ? 'ring-2 ring-blue-400' : ''}`}
              >
                <div className='flex items-center justify-between'>
                  <span className={`text-gray-600`}>
                    {formatDateDisplay(form.startDate, form.endDate)}
                  </span>
                </div>
              </div>

              {/* 日期選擇器 */}
              {showDatePicker && (
                <div
                  className='mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200'
                  ref={datePickerRef}
                >
                  <div className='flex justify-between items-center mb-3'>
                    <span className='text-sm font-medium text-gray-700'>
                      選擇旅行日期
                    </span>
                    <button
                      type='button'
                      onClick={() => setShowDatePicker(false)}
                      className='text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center'
                    >
                      ✕
                    </button>
                  </div>
                  <DayPicker
                    mode='range'
                    selected={{
                      from: form.startDate
                        ? new Date(form.startDate)
                        : undefined,
                      to: form.endDate ? new Date(form.endDate) : undefined,
                    }}
                    onSelect={handleDateSelect}
                    className='mx-auto'
                  />
                </div>
              )}
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
                      className='w-full aspect-square object-cover rounded-2xl'
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
                  <label className='block w-full aspect-square border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all'>
                    <div className='flex flex-col items-center justify-center h-full'>
                      <span className='text-sm text-gray-600 font-medium'>
                        點擊上傳照片
                      </span>
                      <span className='text-xs text-gray-400 mt-1'>
                        建議大小不超過 500KB
                      </span>
                      <span className='text-xs text-gray-400'>
                        支援 JPG、PNG 格式
                      </span>
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
            </div>
          </form>
        </div>

        {/* 底部按鈕 */}
        <div className='p-6 bg-gray-50 rounded-t-2xl border-t border-gray-100'>
          <div className='flex space-x-3'>
            <button
              type='button'
              onClick={handleClose}
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
