import { useEffect, useState } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const Dialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '確認',
  cancelText = '取消',
}: ConfirmDialogProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // 延遲一點讓動畫開始
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // 等待動畫結束再隱藏
      setTimeout(() => setIsAnimating(false), 200);
    }
  }, [isOpen]);

  if (!isAnimating && !isOpen) return null;

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-200 ${
        isVisible ? 'bg-black/60' : 'bg-black/0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl transform transition-all duration-200 ${
          isVisible
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>{title}</h3>
        <p className='text-gray-600 mb-6'>{message}</p>

        <div className='flex space-x-3'>
          <button
            onClick={handleCancel}
            className='flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className='flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer'
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
