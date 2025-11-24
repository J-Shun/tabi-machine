import { useState } from 'react';
import { formatDate, getDuration } from '../../../../helpers';
import MenuButton from '../../../../components/units/MenuButton';

import type { Trip } from '../../../../types';

interface Props {
  trip: Trip;
  onClick: () => void;
  onEdit?: (trip: Trip) => void;
  onDelete?: (tripId: string) => void;
}

const TripCard = ({ trip, onClick, onEdit, onDelete }: Props) => {
  const [showMenu, setShowMenu] = useState(false);

  const start = formatDate(trip.startDate);
  const end = formatDate(trip.endDate);

  const duration = getDuration({
    startDate: trip.startDate,
    endDate: trip.endDate,
  });

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit?.(trip);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete?.(trip.id);
  };

  const handleCardClick = () => {
    if (!showMenu) {
      onClick();
    }
  };

  return (
    <div className='relative'>
      <div
        onClick={handleCardClick}
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

          {/* 右上角三點按鈕 */}
          <div className='absolute top-3 right-3'>
            <MenuButton onClick={handleMenuToggle} />
          </div>
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

      {/* 下拉選單 */}
      {showMenu && (
        <>
          {/* 背景遮罩 */}
          <div
            className='fixed inset-0 z-10'
            onClick={() => setShowMenu(false)}
          />

          {/* 選單 */}
          <div className='absolute top-12 right-3 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]'>
            <button
              onClick={handleEdit}
              className='w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2 cursor-pointer'
            >
              <span>編輯</span>
            </button>
            <button
              onClick={handleDelete}
              className='w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center justify-center space-x-2 cursor-pointer'
            >
              <span>刪除</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TripCard;
