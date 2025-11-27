import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useParams } from '@tanstack/react-router';
import useTripItem from '../../hooks/useTripItem';
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
    editTripDetail,
    deleteTripDetail,
  } = useTripItem({ tripId });

  const [isShowItemModal, setIsShowItemModal] = useState(false);
  const [editingDetail, setEditingDetail] = useState<TripDetail | null>(null);

  const hasScrolledToToday = useRef(false);

  // 用於儲存日期元素的 ref
  const dateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const dateOptions = tripItems ? tripItems.map((item) => item.date) : [];

  const handleBack = () => {
    navigate({ to: '/' });
  };

  // 判斷是否為今天
  const isToday = (date: string) => {
    const today = new Date();
    const todayString = `${today.getFullYear()}/${String(
      today.getMonth() + 1
    ).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
    return date === todayString;
  };

  const handleCloseItemModal = () => {
    setIsShowItemModal(false);
    setEditingDetail(null);
  };

  const handleEditDetail = (detail: TripDetail) => {
    setEditingDetail(detail);
    setIsShowItemModal(true);
  };

  const handleSubmit = (newTripDetail: TripDetail) => {
    const { id } = newTripDetail;
    // 沒有 id，代表是建立新行程
    if (!id) {
      createTripItem(newTripDetail);
    } else {
      // 有 id，代表是編輯行程
      editTripDetail(newTripDetail);
    }
  };

  const handleDelete = (detail: TripDetail) => {
    deleteTripDetail(detail);
  };

  // 自動捲動到今天日期
  useEffect(() => {
    if (!tripItems || hasScrolledToToday.current) return;

    const today = new Date();
    // // 格式：YYYY/MM/DD
    const todayString = `${today.getFullYear()}/${String(
      today.getMonth() + 1
    ).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

    // 找到今天對應的行程日期
    const todayTripItem = tripItems.find((item) => {
      return item.date === todayString;
    });

    if (todayTripItem && dateRefs.current[todayTripItem.date]) {
      // 延遲執行以確保元素已渲染
      setTimeout(() => {
        // 滾動時要把標題列考慮進去
        const headerOffset = 92;
        const element = dateRefs.current[todayTripItem.date];
        if (element) {
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);

      hasScrolledToToday.current = true;
    }
  }, [tripItems]);

  if (!tripItems) return <Loading />;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 標題列 */}
      <div className='bg-white shadow-sm sticky top-0 z-50'>
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
        {tripItems.map((tripItem, dayIndex) => {
          const isTodayCard = isToday(tripItem.date);

          return (
            <div
              key={tripItem.date}
              ref={(el) => {
                dateRefs.current[tripItem.date] = el;
              }}
              className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'
            >
              {/* 日期標題區塊 */}
              <div className='bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between'>
                <div className='text-white'>
                  <div className='flex items-center gap-2'>
                    <h2 className='text-xl font-bold mb-1'>
                      Day {dayIndex + 1}
                    </h2>
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

              <DroppableDateCard
                details={tripItem.details}
                onEdit={handleEditDetail}
                onDelete={handleDelete}
              />
            </div>
          );
        })}
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
          itemData={editingDetail}
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
