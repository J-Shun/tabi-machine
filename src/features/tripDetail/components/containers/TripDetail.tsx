import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useParams } from '@tanstack/react-router';
import useTripDetail from '../../hooks/useTripDetail';
import TripItemModal from '../widgets/TripItemModal';

const TripDetail = () => {
  const navigate = useNavigate();

  const { tripId } = useParams({ from: '/tripDetail/$tripId/' });
  const { tripDetail } = useTripDetail({ tripId });
  const [isShowItemModal, setIsShowItemModal] = useState(false);

  const handleBack = () => {
    navigate({ to: '/' });
  };

  const handleCloseItemModal = () => {
    setIsShowItemModal(false);
  };

  const getDates = () => {
    if (!tripDetail) return [];
    const dates = [];
    const start = new Date(tripDetail.startDate);
    const end = new Date(tripDetail.endDate);

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const formattedDate = d.toLocaleDateString('zh-TW');
      const weekDay = d.toLocaleDateString('zh-TW', { weekday: 'short' });
      dates.push({ date: formattedDate, weekDay, fullDate: new Date(d) });
    }

    return dates;
  };

  // 模擬行程資料，未來會從 API 或 state 取得
  const mockItinerary = [
    {
      id: '1',
      time: '09:00',
      title: '飯店早餐',
      location: '台北君悅酒店',
      type: 'meal',
    },
    {
      id: '2',
      time: '10:30',
      title: '參觀故宮博物院',
      location: '台北市士林區',
      type: 'attraction',
    },
    {
      id: '3',
      time: '12:30',
      title: '鼎泰豐午餐',
      location: '信義店',
      type: 'meal',
    },
    {
      id: '4',
      time: '14:00',
      title: '信義區購物',
      location: '台北101',
      type: 'shopping',
    },
    {
      id: '5',
      time: '18:00',
      title: '寧夏夜市',
      location: '台北市大同區',
      type: 'meal',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meal':
        return 'bg-orange-500';
      case 'attraction':
        return 'bg-blue-500';
      case 'shopping':
        return 'bg-green-500';
      case 'transport':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meal':
        return '🍽️';
      case 'attraction':
        return '🏛️';
      case 'shopping':
        return '🛍️';
      case 'transport':
        return '🚗';
      default:
        return '📍';
    }
  };

  if (!tripDetail) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <div className='text-gray-600'>載入中...</div>
        </div>
      </div>
    );
  }

  const dates = getDates();

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
            <h1 className='text-lg font-bold text-gray-800'>
              {tripDetail.name}
            </h1>
            <p className='text-sm text-gray-500'>{dates.length} 天行程</p>
          </div>
        </div>
      </div>

      {/* 行程內容 */}
      <div className='p-4 space-y-6 pb-24'>
        {dates.map((dateInfo, dayIndex) => (
          <div
            key={dateInfo.date}
            className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'
          >
            {/* 日期標題區塊 */}
            <div className='bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between'>
              <div className='text-white'>
                <h2 className='text-xl font-bold mb-1'>Day {dayIndex + 1}</h2>
                <p className='text-blue-100 text-sm'>
                  {dateInfo.date} ({dateInfo.weekDay})
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
              {dayIndex === 0 ? (
                // 第一天顯示模擬資料
                <div className='relative'>
                  {/* 連續的時間軸線 */}
                  <div className='absolute left-[18px] top-14 bottom-14 w-0.5 bg-gray-300'></div>

                  <div className='space-y-0'>
                    {mockItinerary.map((item) => (
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
                        <div className='flex flex-1 bg-gray-50 rounded-xl p-4 shadow-sm'>
                          <div className='flex-1'>
                            {/* 時間和圖示 */}
                            <div className='flex items-center space-x-2 mb-3'>
                              <span className='text-sm font-medium text-white bg-gray-600 px-2 py-1 rounded'>
                                {item.time}
                              </span>
                              <span className='text-lg'>
                                {getTypeIcon(item.type)}
                              </span>
                            </div>

                            {/* 標題和地點 */}
                            <h3 className='font-semibold text-gray-800 mb-2'>
                              {item.title}
                            </h3>
                            <p className='text-sm text-gray-600 flex items-center'>
                              <span className='mr-1'>📍</span>
                              {item.location}
                            </p>
                          </div>

                          {/* 拖曳按鈕 */}
                          <div className='flex items-center'>
                            <button className='p-2 text-gray-400 active:text-gray-600 transition-colors cursor-pointer'>
                              <svg
                                width='16'
                                height='16'
                                viewBox='0 0 16 16'
                                fill='currentColor'
                              >
                                <circle cx='3' cy='4' r='1' />
                                <circle cx='3' cy='8' r='1' />
                                <circle cx='3' cy='12' r='1' />
                                <circle cx='8' cy='4' r='1' />
                                <circle cx='8' cy='8' r='1' />
                                <circle cx='8' cy='12' r='1' />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // 其他天顯示空狀態
                <div className='text-center py-12 text-gray-400'>
                  <div className='text-4xl mb-4'>📋</div>
                  <p className='text-lg font-medium mb-2'>尚無行程安排</p>
                  <p className='text-sm'>使用右下角 + 按鈕新增行程</p>
                </div>
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
            time: '',
            title: '',
            location: '',
            type: 'meal',
          }}
          mode={'create'}
          onClose={handleCloseItemModal}
          onSubmit={() => {}}
        />
      )}
    </div>
  );
};

export default TripDetail;
