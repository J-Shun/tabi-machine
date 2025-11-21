import type { Identifier, XYCoord } from 'dnd-core';
import { useRef } from 'react';
import { useDrag, useDrop, type DragSourceMonitor } from 'react-dnd';
import MapButton from '../../../../components/units/MapButton';
import DragButton from '../../../../components/units/DragButton';

import type { TripDetail } from '../../../../types';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const DraggableTripItemCard = ({
  detail,
  index,
  moveItem,
}: {
  detail: TripDetail;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'Trip_Item_Card',
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

      // 不自己和自己交換
      if (dragIndex === hoverIndex) {
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
      moveItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'Trip_Item_Card',
    item: () => {
      return { index };
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className='flex w-full bg-gray-50 rounded-xl p-4 shadow-sm'
      style={{ opacity }}
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
