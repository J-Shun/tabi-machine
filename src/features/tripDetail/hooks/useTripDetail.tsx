import { useState, useEffect } from 'react';
import { getDates, createUUID } from '../../../helpers';

import type { Trip, TripDetail, TripItem } from '../../../types';

// 在尚未有 API 時，先使用 localStorage 處理
const useTripDetail = ({ tripId }: { tripId: string }) => {
  const [tripName, setTripName] = useState<string>('');
  const [tripItems, setTripItems] = useState<TripItem[] | null>([]);

  const createTripItem = (newTripItem: TripDetail) => {
    try {
      const tripItem: TripDetail = { ...newTripItem, id: createUUID() };

      // 讀取現有資料，準備更新
      const trip = localStorage.getItem(tripId);
      const parsedTripItems: TripItem[] = trip ? JSON.parse(trip) : [];

      const updatedTripItem = parsedTripItems.map((item) => {
        if (item.date === tripItem.date) {
          return {
            ...item,
            details: [...item.details, tripItem],
          };
        }
        return item;
      });

      // 儲存
      localStorage.setItem(tripId, JSON.stringify(updatedTripItem));

      // 更新本地狀態
      setTripItems(updatedTripItem);
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  useEffect(() => {
    const trips = localStorage.getItem('trips');
    if (!trips) return;
    const parsedTrips: Trip[] = JSON.parse(trips);
    const targetTrip = parsedTrips.find((trip) => trip.id === tripId);

    if (!targetTrip) return;
    setTripName(targetTrip.name);
    const allDates = getDates({
      startDate: targetTrip.startDate,
      endDate: targetTrip.endDate,
    });

    const tripIdData = localStorage.getItem(tripId);
    // 沒有任何資料，新建空資料
    if (!tripIdData) {
      const initialData = allDates.map((date) => ({
        date: date.date,
        weekDay: date.weekDay,
        details: [],
      }));
      const initialDataString = JSON.stringify(initialData);
      localStorage.setItem(tripId, initialDataString);
      setTripItems(initialData);
    } else {
      // 有資料就讀取
      const parsedTripItems = JSON.parse(tripIdData);
      setTripItems(parsedTripItems);
    }
  }, [tripId]);

  return {
    tripName,
    tripItems,
    createTripItem,
  };
};

export default useTripDetail;
