import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import CreateTripModal from '../widgets/CreateTripModal';
import TripCard from '../widgets/TripCard';
import useTrips from '../hooks/useTrips';
import { createUUID } from '../../../../helpers';

import type { Trip } from '../../../../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { trips, createTrip } = useTrips();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const isTripsExist = trips.length > 0;

  const handleTripSelect = (trip: Trip) => {
    navigate({ to: '/tripDetail/' + trip.id });
  };

  const handleCreateTrip = (newTrip: Omit<Trip, 'id'>) => {
    const trip: Trip = {
      ...newTrip,
      id: createUUID(),
    };
    createTrip(trip);
    setShowCreateModal(false);
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100'>
      {/* 頂部區域 */}
      <div className='pt-8 pb-6 px-6 bg-white/80 backdrop-blur-sm'>
        <div className='text-center select-none'>
          <div className='text-4xl mb-2'>✈️</div>
          <h1 className='text-2xl font-bold text-gray-800 mb-1'>我的旅程</h1>
          <p className='text-gray-600 text-sm'>開始規劃你的下一趟冒險</p>
        </div>
      </div>

      {/* 新增行程按鈕 */}
      <div className='px-6 mb-6'>
        <button
          onClick={() => setShowCreateModal(true)}
          className='w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all active:scale-[0.98] mt-4 cursor-pointer'
        >
          <div className='flex items-center justify-center space-x-3'>
            <div className='w-12 h-12 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center'>
              <span className='text-white text-xl'>+</span>
            </div>
            <div className='text-left'>
              <p className='font-semibold text-gray-800'>建立新行程</p>
              <p className='text-sm text-gray-500'>開始規劃你的旅程</p>
            </div>
          </div>
        </button>
      </div>

      {/* 行程列表 */}
      <div className='px-6 pb-8'>
        {isTripsExist && (
          <div className='space-y-4'>
            <h2 className='text-lg font-semibold text-gray-700 mb-4'>
              我的行程
            </h2>
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => handleTripSelect(trip)}
              />
            ))}
          </div>
        )}

        {!isTripsExist && (
          <div className='text-center py-12 select-none'>
            <div className='text-6xl mb-4'>🗺️</div>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
              還沒有任何行程
            </h3>
            <p className='text-gray-500 text-sm leading-relaxed'>
              點擊上方按鈕
              <br />
              建立你的第一個旅遊行程
            </p>
          </div>
        )}
      </div>

      {/* 建立行程彈窗 */}
      {showCreateModal && (
        <CreateTripModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTrip}
        />
      )}
    </div>
  );
};

export default Dashboard;
