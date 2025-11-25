import { useState } from 'react';
import MapButton from '../../../../components/units/MapButton';
import Dialog from '../../../../components/units/Dialog';

import type { TripDetail } from '../../../../types';

const DraggableTripItemCard = ({
  detail,
  onEdit,
  onDelete,
}: {
  detail: TripDetail;
  index: number;
  sourceDate: string;
  onEdit: (detail: TripDetail) => void;
  onDelete: (detail: TripDetail) => void;
}) => {
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);

  const handleClick = () => {
    onEdit(detail);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete(detail);
    setIsShowDeleteDialog(false);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className='flex w-full bg-gray-50 rounded-xl p-4 m-0 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors relative'
      >
        <div className='w-full pr-'>
          <div className='flex items-center justify-between space-x-2 mb-2'>
            {/* 標題和地點 */}
            <h3 className='font-semibold text-gray-800'>{detail.title}</h3>

            {/* 刪除按鈕 */}
            <button
              onClick={handleDelete}
              className='group w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 cursor-pointer'
              aria-label={`刪除 ${detail.title}`}
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
          </div>
          <MapButton location={detail.location} />
        </div>
      </div>
      <Dialog
        isOpen={isShowDeleteDialog}
        onClose={() => setIsShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title='刪除行程'
        message={`確定要刪除「${detail.title}」嗎？`}
        confirmText='刪除'
        cancelText='取消'
      />
    </>
  );
};

export default DraggableTripItemCard;
