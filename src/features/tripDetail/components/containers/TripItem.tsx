import { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useParams } from '@tanstack/react-router';
import useTripDetail from '../../hooks/useTripDetail';
import TripDetailModal from '../widgets/TripDetailModal';
import Loading from '../../../../components/units/Loading';
import DroppableDateCard from '../widgets/DroppableDateCard';

import type { TripDetail } from '../../../../types';

const TripItem = () => {
  const navigate = useNavigate();

  const { tripId } = useParams({ from: '/tripItem/$tripId/' });

  const {
    tripItems,
    tripName,
    createTripItem,
    editTripItem,
    moveDetailToEmptyDate,
    moveDetailToNewPosition,
  } = useTripDetail({ tripId });

  const [isShowItemModal, setIsShowItemModal] = useState(false);
  const [editingDetail, setEditingDetail] = useState<TripDetail | null>(null);

  const dateOptions = tripItems ? tripItems.map((item) => item.date) : [];

  const handleBack = () => {
    navigate({ to: '/' });
  };

  const handleCloseItemModal = () => {
    setIsShowItemModal(false);
    setEditingDetail(null);
  };

  const handleEditDetail = (detail: TripDetail) => {
    setEditingDetail(detail);
    setIsShowItemModal(true);
  };

  const moveItem = useCallback(
    ({
      sourceDate,
      targetDate,
      dragIndex,
      hoverIndex,
    }: {
      sourceDate: string;
      targetDate: string;
      dragIndex: number;
      hoverIndex: number;
    }) => {
      moveDetailToNewPosition({
        sourceDate,
        targetDate,
        dragIndex,
        hoverIndex,
      });
    },
    [moveDetailToNewPosition]
  );

  const moveItemBetweenDates = useCallback(
    ({
      sourceDate,
      targetDate,
      dragIndex,
    }: {
      sourceDate: string;
      targetDate: string;
      dragIndex: number;
    }) => {
      moveDetailToEmptyDate({ sourceDate, targetDate, dragIndex });
    },
    [moveDetailToEmptyDate]
  );

  const handleSubmit = (newTripDetail: TripDetail) => {
    const { id } = newTripDetail;
    // 沒有 id，代表是建立新行程
    if (!id) {
      createTripItem(newTripDetail);
    } else {
      // 有 id，代表是編輯行程
      editTripItem(newTripDetail);
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

            <DroppableDateCard
              date={tripItem.date}
              details={tripItem.details}
              moveItem={moveItem}
              moveItemBetweenDates={moveItemBetweenDates}
              onEdit={handleEditDetail}
            />
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

      {/* 行程項目詳情彈窗 */}
      {isShowItemModal && (
        <TripDetailModal
          itemData={
            editingDetail || {
              id: '',
              title: '',
              date: dateOptions[0],
              location: '',
              type: 'meal',
            }
          }
          dateOptions={dateOptions}
          mode={editingDetail ? 'edit' : 'create'}
          onClose={handleCloseItemModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default TripItem;
