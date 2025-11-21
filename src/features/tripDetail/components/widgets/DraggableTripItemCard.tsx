import type { Identifier, XYCoord } from 'dnd-core';
import { useRef } from 'react';
import { useDrag, useDrop, type DragSourceMonitor } from 'react-dnd';
import MapButton from '../../../../components/units/MapButton';
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
}) => {
  const ref = useRef<HTMLDivElement>(null);
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

  const [, drag] = useDrag({
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

  drag(drop(ref));

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className='flex w-full bg-gray-50 rounded-xl p-4 shadow-sm cursor-pointer'
    >
      <div className='w-full'>
        <div className='flex items-center space-x-2 mb-2'>
          {/* 標題和地點 */}
          <h3 className='font-semibold text-gray-800'>{detail.title}</h3>
        </div>
        <MapButton location={detail.location} />
      </div>
    </div>
  );
};

export default DraggableTripItemCard;
