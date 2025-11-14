import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useParams } from '@tanstack/react-router';

interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  country?: string;
  coverImage?: string;
}

const TripDetail = () => {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);

  const { tripId } = useParams({ from: '/tripDetail/$tripId/' });

  useEffect(() => {
    // 暫時使用 mock 資料
    const mockTrip: Trip = {
      id: tripId,
      name: '東京五日遊',
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      country: '日本',
    };
    setTrip(mockTrip);
  }, [tripId]);

  const handleBack = () => {
    navigate({ to: '/' });
  };

  const getDates = () => {
    if (!trip) return [];
    const dates = [];
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }
    return dates;
  };

  if (!trip) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div>載入中...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 標題列 */}
      <div className='bg-white shadow-sm p-4 flex items-center'>
        <button onClick={handleBack} className='mr-3 text-xl'>
          ←
        </button>
        <h1 className='text-lg font-bold'>{trip.name}</h1>
      </div>

      {/* 行程日期區段 */}
      <div className='p-4 space-y-6'>
        {getDates().map((date, index) => (
          <div
            key={date}
            className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'
          >
            <h2 className='text-lg font-semibold mb-4'>
              Day {index + 1} - {new Date(date).toLocaleDateString('zh-TW')}
            </h2>
            <div className='text-center py-8 text-gray-400'>
              點擊 + 新增行程項目
            </div>
          </div>
        ))}
      </div>

      {/* 新增按鈕 */}
      <div className='fixed bottom-6 right-6'>
        <button className='w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600'>
          <span className='text-white text-2xl'>+</span>
        </button>
      </div>
    </div>
  );
};

export default TripDetail;
