import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
import ImgUploadArea from '../units/ImgUploadArea';
import 'react-day-picker/style.css';
import { zhTW } from 'react-day-picker/locale';

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

  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const [isShowDatePicker, setIsShowDatePicker] = useState(false);

  const title = mode === 'create' ? '建立新行程' : '編輯行程';
  const info = mode === 'create' ? '開始規劃你的精彩旅程' : '修改你的旅程規劃';
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
      setIsShowDatePicker(false);
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
    setIsShowDatePicker(!isShowDatePicker);
  };

  // 關閉動畫處理
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setIsVisible(false);
    if (modalRef.current) {
      modalRef.current.style.opacity = '0';
      modalRef.current.style.transform = 'scale(0.95)';
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

  // 背景點擊關閉
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isClosing) {
      handleClose();
    }
  };

  // 入場動畫
  useEffect(() => {
    setIsVisible(true);

    if (modalRef.current && !isClosing) {
      modalRef.current.style.opacity = '0';
      modalRef.current.style.transform = 'scale(0.95)';
      requestAnimationFrame(() => {
        if (modalRef.current) {
          modalRef.current.style.opacity = '1';
          modalRef.current.style.transform = 'scale(1)';
        }
      });
    }
  }, [isClosing]);

  // 點擊外部關閉日期選擇器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isShowDatePicker &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsShowDatePicker(false);
      }
    };

    if (isShowDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShowDatePicker]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out ${
        isVisible
          ? 'bg-black/60 backdrop-blur-sm'
          : 'bg-black/0 backdrop-blur-none'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className='bg-white rounded-3xl w-full max-w-md max-h-[90vh] shadow-2xl transition-all duration-300 ease-out overflow-hidden'
        style={{ opacity: '0', transform: 'scale(0.95)' }}
      >
        {/* 標題區域 */}
        <div className='p-6 border-b border-gray-100'>
          <div className='text-center'>
            <h2 className='text-xl font-bold text-gray-800 mb-1'>{title}</h2>
            <p className='text-sm text-gray-500'>{info}</p>
          </div>
        </div>

        {/* 表單內容 */}
        <div className='max-h-[60vh] overflow-y-auto'>
          <form onSubmit={handleSubmit} className='p-6 space-y-6'>
            {/* 行程名稱 */}
            <div>
              <div className='flex items-center space-x-2 mb-3'>
                <label className='font-semibold text-gray-800'>行程名稱</label>
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
                <label className=' font-semibold text-gray-800'>旅行日期</label>
                <span className='text-red-400'>*</span>
              </div>

              <div className='relative' ref={datePickerRef}>
                {/* 日期顯示框 */}
                <div
                  onClick={handleDateDisplayClick}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-2xl cursor-pointer transition-all ${isShowDatePicker ? 'ring-2 ring-blue-400' : ''}`}
                >
                  <div className='flex items-center justify-between'>
                    <span className={`text-gray-600`}>
                      {formatDateDisplay(form.startDate, form.endDate)}
                    </span>
                  </div>
                </div>

                {/* 日期選擇器 */}
                {isShowDatePicker && (
                  <div className='absolute left-0 right-0 z-10 w-full mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200'>
                    <DayPicker
                      locale={zhTW}
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
            </div>

            {/* 封面照片 */}
            <div>
              <div className='flex items-center space-x-2 mb-3'>
                <label className='font-semibold text-gray-800'>封面照片</label>
              </div>

              {/* 圖片預覽或上傳區域 */}
              <ImgUploadArea
                img={form.coverImage}
                onUpload={(dataUrl) =>
                  setForm({ ...form, coverImage: dataUrl })
                }
                onCancel={() => setForm({ ...form, coverImage: '' })}
              />
            </div>
          </form>
        </div>

        {/* 底部按鈕 */}
        <div className='p-6 bg-gray-50 rounded-b-3xl border-t border-gray-100'>
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
