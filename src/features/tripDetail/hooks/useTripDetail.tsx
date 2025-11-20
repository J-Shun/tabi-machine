import { useState, useEffect } from 'react';
import { getDates, createUUID } from '../../../helpers';

import type { Trip, TripItem } from '../../../types';

interface TripDetail {
  date: string;
  weekDay: string;
  items: TripItem[];
}

// 在尚未有 API 時，先使用 localStorage 處理
const useTripDetail = ({ tripId }: { tripId: string }) => {
  const [tripName, setTripName] = useState<string>('');
  const [tripItems, setTripItems] = useState<TripDetail[] | null>([]);

  const createTripItem = (newTripItem: TripItem) => {
    try {
      const tripItem: TripItem = { ...newTripItem, id: createUUID() };

      // 讀取現有資料，準備更新
      const tripDetail = localStorage.getItem(tripId);
      const parsedTripDetail: TripDetail[] = tripDetail
        ? JSON.parse(tripDetail)
        : [];

      const updatedTripDetail = parsedTripDetail.map((detail) => {
        if (detail.date === tripItem.date) {
          return {
            ...detail,
            items: [...detail.items, tripItem],
          };
        }
        return detail;
      });

      // 儲存
      localStorage.setItem(tripId, JSON.stringify(updatedTripDetail));

      // 更新本地狀態
      setTripItems(updatedTripDetail);
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
        items: [],
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
