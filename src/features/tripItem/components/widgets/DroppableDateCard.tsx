import { useDrop } from 'react-dnd';
import DraggableTripItemCard from './DraggableTripItemCard';
import Empty from '../units/Empty';
import { getTypeColor } from '../../../../helpers';
import { ItemTypes } from '../../constants/itemTypes';
import { motion } from 'framer-motion';

import type { TripDetail } from '../../../../types';

interface DragItem {
  index: number;
  detail: TripDetail;
  sourceDate: string;
  type: string;
}

const DroppableDateCard = ({
  date,
  details,
  moveItem,
  moveItemBetweenDates,
  onEdit,
}: {
  date: string;
  details: TripDetail[];
  moveItem: (params: {
    sourceDate: string;
    targetDate: string;
    dragIndex: number;
    hoverIndex: number;
  }) => void;
  moveItemBetweenDates: (params: {
    sourceDate: string;
    targetDate: string;
    dragIndex: number;
  }) => void;
  onEdit: (detail: TripDetail) => void;
}) => {
  const [, drop] = useDrop({
    accept: ItemTypes.DETAIL_CARD,
    hover: (item: DragItem) => {
      // 如果是跨日期移動，且目標日期沒有項目
      if (item.sourceDate !== date && details.length === 0) {
        moveItemBetweenDates({
          sourceDate: item.sourceDate,
          targetDate: date,
          dragIndex: item.index,
        });

        // 更新拖曳來源的索引，好讓後續的 hover 能正確判斷
        item.index = 0;
        item.sourceDate = date;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <motion.div
      ref={drop as never}
      className='p-6'
      layout
      transition={{ duration: 0.2 }}
    >
      {details.length ? (
        <div className='relative'>
          {/* 連續的時間軸線 */}
          <div className='absolute left-[18px] top-14 bottom-14 w-0.5 bg-gray-300' />

          <div className='space-y-0'>
            {details.map((detail, index) => (
              <motion.div
                key={detail.id}
                layout
                transition={{ duration: 0.2 }}
                className='flex items-stretch space-x-4 relative pb-6 last:pb-0'
              >
                {/* 時間軸點 */}
                <div className='flex items-center'>
                  <div
                    className={`w-4 h-4 rounded-full ml-[11px] ${getTypeColor(detail.type)} shadow-sm shrink-0`}
                  />
                </div>

                {/* 行程內容卡片 */}
                <DraggableTripItemCard
                  detail={detail}
                  index={index}
                  sourceDate={date}
                  moveItem={moveItem}
                  onEdit={onEdit}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <Empty />
      )}
    </motion.div>
  );
};

export default DroppableDateCard;
