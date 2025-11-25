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
      <div onClick={handleCardClick} className='cursor-pointer'>
        {/* 拍立得整體 */}
        <div className='bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 hover:shadow-xl transition-all active:scale-[0.98] rotate-1 hover:rotate-0 duration-300'>
          {/* 圖片區域 */}
          <div className='aspect-square relative overflow-hidden rounded-lg mb-4'>
            {trip.coverImage ? (
              <img
                src={trip.coverImage}
                alt={trip.name}
                className='w-full h-full object-cover filter sepia-[0.1] contrast-[1.1] brightness-[1.05]'
              />
            ) : (
              <div className='w-full h-full bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center'>
                <div className='text-4xl opacity-60'>🗺️</div>
              </div>
            )}

            {/* 右上角三點按鈕 */}
            <div className='absolute top-2 right-2'>
              <MenuButton onClick={handleMenuToggle} />
            </div>
          </div>

          {/* 內容區域（拍立得下方留白） */}
          <div className='space-y-2'>
            <h3 className='font-semibold text-gray-800 text-lg line-clamp-1'>
              {trip.name}
            </h3>

            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center space-x-1 text-gray-600'>
                <span>🗓️</span>
                <span>
                  {start} - {end}
                </span>
              </div>
              <div className='bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs font-medium border border-amber-200'>
                {duration} 天
              </div>
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
          <div className='absolute top-12 right-7 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]'>
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
