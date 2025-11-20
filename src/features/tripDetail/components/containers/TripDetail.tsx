import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useParams } from '@tanstack/react-router';
import useTripDetail from '../../hooks/useTripDetail';
import TripItemModal from '../widgets/TripItemModal';
import DragButton from '../../../../components/units/DragButton';
import MapButton from '../../../../components/units/MapButton';
import Loading from '../../../../components/units/Loading';
import Empty from '../units/Empty';
import { getTypeColor } from '../../../../helpers';

import type { TripItem } from '../../../../types';

const TripDetail = () => {
  const navigate = useNavigate();

  const { tripId } = useParams({ from: '/tripDetail/$tripId/' });
  const { tripItems, tripName, createTripItem } = useTripDetail({ tripId });
  const [isShowItemModal, setIsShowItemModal] = useState(false);

  const dateOptions = tripItems ? tripItems.map((item) => item.date) : [];

  const handleBack = () => {
    navigate({ to: '/' });
  };

  const handleCloseItemModal = () => {
    setIsShowItemModal(false);
  };

  const handleSubmit = (newTripItem: TripItem) => {
    const { id } = newTripItem;
    // 沒有 id，代表是建立新行程
    if (!id) {
      createTripItem(newTripItem);
    } else {
      // 有 id，代表是編輯行程
      // TODO
    }
  };

  if (!tripItems) return <Loading />;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 標題列 */}
      <div className='bg-white shadow-sm sticky top-0 z-10'>
        <div className='p-4 flex items-center'>
          <button
            onClick={handleBack}
            className='mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer'
          >
            <span className='text-xl'>←</span>
          </button>
          <div className='flex-1'>
            <h1 className='text-lg font-bold text-gray-800'>{tripName}</h1>
            <p className='text-sm text-gray-500'>{tripItems.length} 天行程</p>
          </div>
        </div>
      </div>

      {/* 行程內容 */}
      <div className='p-4 space-y-6 pb-24'>
        {tripItems.map((tripItem, dayIndex) => (
          <div
            key={tripItem.date}
            className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'
          >
            {/* 日期標題區塊 */}
            <div className='bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between'>
              <div className='text-white'>
                <h2 className='text-xl font-bold mb-1'>Day {dayIndex + 1}</h2>
                <p className='text-blue-100 text-sm'>
                  {tripItem.date} ({tripItem.weekDay})
                </p>
              </div>
              <div className='text-white/80'>
                <button className='p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer'>
                  <span>⋯</span>
                </button>
              </div>
            </div>

            {/* 行程時間軸內容 */}
            <div className='p-6'>
              {tripItem.items.length ? (
                <div className='relative'>
                  {/* 連續的時間軸線 */}
                  <div className='absolute left-[18px] top-14 bottom-14 w-0.5 bg-gray-300' />

                  <div className='space-y-0'>
                    {tripItem.items.map((item) => (
                      <div
                        key={item.id}
                        className='flex items-stretch space-x-4 relative pb-6 last:pb-0'
                      >
                        {/* 時間軸點 */}
                        <div className='flex items-center'>
                          <div
                            className={`w-4 h-4 rounded-full ml-[11px] ${getTypeColor(item.type)} shadow-sm shrink-0`}
                          />
                        </div>

                        {/* 行程內容卡片 */}
                        <div className='flex w-full bg-gray-50 rounded-xl p-4 shadow-sm'>
                          <div className='w-full'>
                            <div className='flex items-center space-x-2 mb-2'>
                              {/* 標題和地點 */}
                              <h3 className='font-semibold text-gray-800'>
                                {item.title}
                              </h3>
                            </div>
                            <MapButton location={item.location} />
                          </div>

                          {/* 拖曳按鈕 */}
                          <div className='flex items-center'>
                            <DragButton />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Empty />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 浮動新增按鈕 */}
      <div className='fixed bottom-6 right-6 z-20'>
        <button
          className='w-14 h-14 bg-blue-500 hover:bg-blue-600 active:scale-95 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer'
          onClick={() => setIsShowItemModal(true)}
        >
          <span className='text-white text-2xl font-bold'>+</span>
        </button>
      </div>

      {/* 行程項目詳情彈窗範例 */}
      {isShowItemModal && (
        <TripItemModal
          itemData={{
            id: '',
            title: '',
            date: dateOptions[0],
            location: '',
            type: 'meal',
          }}
          dateOptions={dateOptions}
          mode={'create'}
          onClose={handleCloseItemModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default TripDetail;
