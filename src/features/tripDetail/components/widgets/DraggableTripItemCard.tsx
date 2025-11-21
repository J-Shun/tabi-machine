import type { Identifier } from 'dnd-core';
import { useRef } from 'react';
import { useDrag, useDrop, type DragSourceMonitor } from 'react-dnd';
import MapButton from '../../../../components/units/MapButton';
import DragButton from '../../../../components/units/DragButton';
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
    hover(item: DragItem) {
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

      // 執行交換（移除中間點限制）
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
      className='flex w-full bg-gray-50 rounded-xl p-4 shadow-sm'
    >
      <div className='w-full'>
        <div className='flex items-center space-x-2 mb-2'>
          {/* 標題和地點 */}
          <h3 className='font-semibold text-gray-800'>{detail.title}</h3>
        </div>
        <MapButton location={detail.location} />
      </div>

      {/* 拖曳按鈕 */}
      <div className='flex items-center'>
        <DragButton />
      </div>
    </div>
  );
};

export default DraggableTripItemCard;
