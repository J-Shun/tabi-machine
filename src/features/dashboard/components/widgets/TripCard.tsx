import { formatDate, getDuration } from '../../../../helpers';

interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  country?: string;
  coverImage?: string;
}

interface Props {
  trip: Trip;
  onClick: () => void;
}

const TripCard = ({ trip, onClick }: Props) => {
  const start = formatDate(trip.startDate);
  const end = formatDate(trip.endDate);

  const duration = getDuration({
    startDate: trip.startDate,
    endDate: trip.endDate,
  });

  return (
    <div
      onClick={onClick}
      className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all active:scale-[0.98] cursor-pointer'
    >
      {/* 封面區域 */}
      <div className='h-32 bg-linear-to-br from-indigo-400 via-purple-400 to-pink-400 relative overflow-hidden'>
        {trip.coverImage && (
          <img
            src={trip.coverImage}
            alt={trip.name}
            className='w-full h-full object-cover'
          />
        )}

        {!trip.coverImage && (
          <div className='w-full h-full flex items-center justify-center'>
            <div className='text-3xl'>🗺️</div>
          </div>
        )}

        {/* 左上角標籤 */}
        {trip.country && (
          <div className='absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex justify-center'>
            <span className='text-xs font-medium text-gray-700'>
              {trip.country}
            </span>
          </div>
        )}
      </div>

      {/* 內容區域 */}
      <div className='p-4'>
        <h3 className='font-semibold text-gray-800 text-lg mb-2 line-clamp-1'>
          {trip.name}
        </h3>

        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center space-x-1 text-gray-600'>
            <span>🗓️</span>
            <span>
              {start} - {end}
            </span>
          </div>
          <div className='bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-medium'>
            {duration} 天
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
