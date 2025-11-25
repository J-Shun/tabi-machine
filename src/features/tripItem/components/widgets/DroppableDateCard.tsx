import DraggableTripItemCard from './DraggableTripItemCard';
import Empty from '../units/Empty';
import { getTypeColor } from '../../../../helpers';

import type { TripDetail } from '../../../../types';

const DroppableDateCard = ({
  details,
  onEdit,
  onDelete,
}: {
  details: TripDetail[];
  onEdit: (detail: TripDetail) => void;
  onDelete: (detail: TripDetail) => void;
}) => {
  return (
    <div className='p-6'>
      {details.length ? (
        <div className='relative'>
          {/* 連續的時間軸線 */}
          <div className='absolute left-[18px] top-14 bottom-14 w-0.5 bg-gray-300' />

          <div className='space-y-0'>
            {details.map((detail) => (
              <div
                key={detail.id}
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
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default DroppableDateCard;
