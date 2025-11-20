import { useState, useEffect } from 'react';
import { createUUID } from '../../../../helpers';
import type { Trip } from '../../../../types';

// 在尚未有 API 時，先使用 localStorage 處理
const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createTrip = (newTrip: Omit<Trip, 'id'>) => {
    try {
      const trip: Trip = { ...newTrip, id: createUUID() };

      // 新建立的行程放在最前面
      const payload = [trip, ...trips];

      localStorage.setItem('trips', JSON.stringify(payload));

      // 更新本地狀態
      // TODO: 若未來有 API，這邊要改成重新抓取最新資料
      setTrips(payload);
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  const editTrip = (updatedTrip: Trip) => {
    try {
      const { id } = updatedTrip;

      // 更新指定 id 的行程資料
      const payload = trips.map((trip) =>
        trip.id === id ? { ...trip, ...updatedTrip } : trip
      );

      localStorage.setItem('trips', JSON.stringify(payload));
      setTrips(payload);
    } catch (error) {
      console.error('Failed to edit trip:', error);
    }
  };

  const deleteTrip = (tripId: string) => {
    try {
      const payload = trips.filter((trip) => trip.id !== tripId);
      localStorage.setItem('trips', JSON.stringify(payload));
      setTrips(payload);
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  const loadTrips = async () => {
    try {
      // 模仿一點載入時間
      await new Promise((resolve) => setTimeout(resolve, 100));
      const storedTrips = localStorage.getItem('trips');
      if (!storedTrips) return;

      const parsedTrips: Trip[] = JSON.parse(storedTrips);
      setTrips(parsedTrips);
    } catch (error) {
      console.error('Failed to load trips:', error);
      // 如果資料損壞，重置為空陣列
      setTrips([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await loadTrips();
      setIsLoading(false);
    };
    init();
  }, []);

  return { trips, isLoading, createTrip, editTrip, deleteTrip };
};

export default useTrips;
