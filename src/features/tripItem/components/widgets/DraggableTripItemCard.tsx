import type { Identifier, XYCoord } from 'dnd-core';
import { useState, useRef } from 'react';
import { useDrag, useDrop, type DragSourceMonitor } from 'react-dnd';
import MapButton from '../../../../components/units/MapButton';
import Dialog from '../../../../components/units/Dialog';
import { ItemTypes } from '../../constants/itemTypes';

import type { TripDetail } from '../../../../types';

interface DragItem {
  index: number;
  detail: TripDetail;
  sourceDate: string;
  type: string;
}

const DraggableTripItemCard = ({
  detail,
  index,
  sourceDate,
  moveItem,
  onEdit,
  onDelete,
}: {
  detail: TripDetail;
  index: number;
  sourceDate: string;
  moveItem: (params: {
    sourceDate: string;
    targetDate: string;
    dragIndex: number;
    hoverIndex: number;
  }) => void;
  onEdit: (detail: TripDetail) => void;
  onDelete: (detail: TripDetail) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.DETAIL_CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragSourceDate = item.sourceDate;
      const hoverTargetDate = sourceDate;

      // 在原有的卡片上，不自己和自己交換
      if (dragSourceDate === hoverTargetDate && dragIndex === hoverIndex) {
        return;
      }

      // 獲取元件邊界
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // 計算中點
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // 獲取滑鼠位置
      const clientOffset = monitor.getClientOffset();

      // 計算滑鼠位置相對於元件頂部的距離
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // 向下拖曳，只有在超過中點時才交換
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

      // 向上拖曳，只有在低於中點時才交換
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // 執行交換
      moveItem({
        sourceDate: dragSourceDate,
        targetDate: hoverTargetDate,
        dragIndex: dragIndex,
        hoverIndex: hoverIndex,
      });

      // 更新拖曳來源的索引，好讓後續的 hover 能正確判斷
      item.index = hoverIndex;
      item.sourceDate = hoverTargetDate;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.DETAIL_CARD,
    item: () => {
      return {
        index,
        detail,
        sourceDate,
        type: ItemTypes.DETAIL_CARD,
      };
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleClick = () => {
    // 只有在沒有拖曳的時候才觸發點擊事件
    if (!isDragging) {
      onEdit(detail);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete(detail);
    setIsShowDeleteDialog(false);
  };

  drag(drop(ref));

  return (
    <>
      <div
        ref={ref}
        data-handler-id={handlerId}
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
