import { isToday } from '../../../../helpers';
import type { TripItem } from '../../../../types';

const TripItemHeader = ({
  tripItem,
  day,
}: {
  tripItem: TripItem;
  day: number;
}) => {
  const isTodayCard = isToday(tripItem.date);

  return (
    <div className='bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between'>
      <div className='text-white'>
        <div className='flex items-center gap-2'>
          <h2 className='text-xl font-bold mb-1'>Day {day}</h2>
          {isTodayCard && (
            <span className='bg-white/20 px-2 py-1 rounded-full text-xs font-medium'>
              今天
            </span>
          )}
        </div>
        <p className='text-blue-100 text-sm'>
          {tripItem.date} ({tripItem.weekDay})
        </p>
      </div>
    </div>
  );
};

export default TripItemHeader;
