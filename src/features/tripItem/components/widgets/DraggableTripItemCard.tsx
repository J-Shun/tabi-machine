import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MapButton from '../../../../components/units/MapButton';
import DeleteButton from '../../../../components/units/DeleteButton';
import Dialog from '../../../../components/units/Dialog';

import type { TripDetail } from '../../../../types';

const DraggableTripItemCard = ({
  detail,
  onEdit,
  onDelete,
}: {
  detail: TripDetail;
  onEdit: (detail: TripDetail) => void;
  onDelete: (detail: TripDetail) => void;
}) => {
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: detail.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

  const handleDragHandleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className='relative flex items-center w-full'>
        {/* 主要卡片內容 */}
        <div
          ref={setNodeRef}
          style={style}
          onClick={handleClick}
          className={`flex w-full bg-gray-50 rounded-xl p-4 m-0 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors relative ${
            isDragging ? 'opacity-50' : ''
          }`}
        >
          <div className='w-full'>
            <div className='flex items-center justify-between space-x-2 mb-2'>
              {/* 標題和地點 */}
              <h3 className='font-semibold text-gray-800'>{detail.title}</h3>

              {/* 刪除按鈕 */}
              <DeleteButton onClick={handleDelete} />
            </div>
            <MapButton location={detail.location} />
          </div>
        </div>

        {/* 拖拽把手 - 書籤樣式 */}
        <div
          {...attributes}
          {...listeners}
          onClick={handleDragHandleClick}
          className={`flex items-center justify-center w-6 ml-3 transition-opacity duration-200 cursor-grab active:cursor-grabbing ${
            isDragging ? 'opacity-100' : ''
          }`}
          style={{
            width: '24px',
            height: '32px',
          }}
        >
          <svg
            width='12'
            height='16'
            viewBox='0 0 12 16'
            fill='none'
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <circle cx='3' cy='3' r='1.5' fill='currentColor' />
            <circle cx='9' cy='3' r='1.5' fill='currentColor' />
            <circle cx='3' cy='8' r='1.5' fill='currentColor' />
            <circle cx='9' cy='8' r='1.5' fill='currentColor' />
            <circle cx='3' cy='13' r='1.5' fill='currentColor' />
            <circle cx='9' cy='13' r='1.5' fill='currentColor' />
          </svg>
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
