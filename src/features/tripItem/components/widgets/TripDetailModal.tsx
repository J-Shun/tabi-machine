import React, { useState, useRef, useEffect, useCallback } from 'react';

import type { TripDetail } from '../../../../types';

interface Props {
  itemData: TripDetail | null;
  mode: 'create' | 'edit';
  dateOptions: string[];
  onClose: () => void;
  onSubmit: (item: TripDetail) => void;
}

const typeOptions = [
  { value: 'attraction', label: '景點' },
  { value: 'accommodation', label: '住宿' },
  { value: 'meal', label: '美食' },
  { value: 'shopping', label: '購物' },
  { value: 'transport', label: '交通' },
  { value: 'other', label: '其他' },
];

const TripDetailModal = ({
  itemData,
  dateOptions,
  mode,
  onClose,
  onSubmit,
}: Props) => {
  const [form, setForm] = useState<TripDetail>({
    id: itemData?.id || '',
    title: itemData?.title || '',
    date: itemData?.date || dateOptions[0] || '',
    location: itemData?.location || '',
    type: itemData?.type || 'attraction',
    notes: itemData?.notes || '',
  });

  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const title = mode === 'create' ? '新增行程項目' : '編輯行程項目';
  const confirmText = mode === 'create' ? '新增項目' : '更新項目';

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
    if (form.title && form.date) {
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
            <p className='text-sm text-gray-500'>記錄你的旅程細節</p>
          </div>
        </div>

        {/* 表單內容 */}
        <div className='max-h-[60vh] overflow-y-auto'>
          <form onSubmit={handleSubmit} className='p-6 space-y-6'>
            {/* 日期選擇 */}
            <div>
              <div className='flex items-center space-x-2 mb-3'>
                <label className='text-base font-semibold text-gray-800'>
                  行程日期
                </label>
                <span className='text-red-400'>*</span>
              </div>
              <select
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className='w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all'
                required
              >
                {dateOptions.map((option, index) => (
                  <option key={option} value={option}>
                    Day {index + 1} - {option}
                  </option>
                ))}
              </select>
            </div>

            {/* 項目標題 */}
            <div>
              <div className='flex items-center space-x-2 mb-3'>
                <label className='text-base font-semibold text-gray-800'>
                  項目名稱
                </label>
                <span className='text-red-400'>*</span>
              </div>
              <input
                type='text'
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className='w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all'
                placeholder='例：東京晴空塔'
                required
              />
            </div>

            {/* 類型 */}
            <div>
              <div className='flex items-center space-x-2 mb-3'>
                <label className='text-base font-semibold text-gray-800'>
                  類型
                </label>
              </div>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as TripDetail['type'],
                  })
                }
                className='w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all'
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 地點 */}
            <div>
              <div className='flex items-center space-x-2 mb-3'>
                <label className='text-base font-semibold text-gray-800'>
                  地點
                </label>
              </div>
              <input
                type='text'
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className='w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all'
                placeholder='請填入地點名稱或地址...'
              />
            </div>

            {/* 備註 */}
            <div>
              <div className='flex items-center space-x-2 mb-3'>
                <label className='text-base font-semibold text-gray-800'>
                  備註
                </label>
              </div>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className='w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all resize-none'
                rows={3}
                placeholder='記錄特別的注意事項或想法...'
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
              disabled={!form.title}
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

export default TripDetailModal;
