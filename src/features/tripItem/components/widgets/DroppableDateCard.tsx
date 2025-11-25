import DraggableTripItemCard from './DraggableTripItemCard';
import Empty from '../units/Empty';
import { getTypeColor } from '../../../../helpers';
import { motion } from 'framer-motion';

import type { TripDetail } from '../../../../types';

const DroppableDateCard = ({
  date,
  details,
  onEdit,
  onDelete,
}: {
  date: string;
  details: TripDetail[];
  onEdit: (detail: TripDetail) => void;
  onDelete: (detail: TripDetail) => void;
}) => {
  return (
    <motion.div className='p-6' layout transition={{ duration: 0.2 }}>
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
                  onEdit={onEdit}
                  onDelete={onDelete}
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
