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

  const moveDetailToNewPosition = ({
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
    if (!tripItems) return;

    // 複製一份 tripItems 資料
    const newTripItems = [...tripItems];

    const sourceDateIndex = newTripItems.findIndex(
      (item) => item.date === sourceDate
    );
    const targetDateIndex = newTripItems.findIndex(
      (item) => item.date === targetDate
    );

    // 找不到日期就返回
    if (sourceDateIndex === -1 || targetDateIndex === -1) return;

    // 從來源日期移除項目
    const [movedItem] = newTripItems[sourceDateIndex].details.splice(
      dragIndex,
      1
    );

    // 插入到目標日期的指定位置
    newTripItems[targetDateIndex].details.splice(hoverIndex, 0, movedItem);

    // 更新本地存儲
    localStorage.setItem(tripId, JSON.stringify(newTripItems));

    // 更新畫面
    setTripItems(newTripItems);
  };

  const moveDetailToEmptyDate = ({
    sourceDate,
    targetDate,
    dragIndex,
  }: {
    sourceDate: string;
    targetDate: string;
    dragIndex: number;
  }) => {
    if (!tripItems) return;

    // 複製一份 tripItems 資料
    const newTripItems = [...tripItems];

    const sourceDateIndex = newTripItems.findIndex(
      (item) => item.date === sourceDate
    );
    const targetDateIndex = newTripItems.findIndex(
      (item) => item.date === targetDate
    );

    // 找不到日期就返回
    if (sourceDateIndex === -1 || targetDateIndex === -1) return;

    // 從來源日期移除項目
    const [movedItem] = newTripItems[sourceDateIndex].details.splice(
      dragIndex,
      1
    );

    // 更新項目的日期
    const updatedItem = { ...movedItem, date: targetDate };
    // 插入到目標日期的末尾
    newTripItems[targetDateIndex].details.push(updatedItem);

    // 更新本地存儲
    localStorage.setItem(tripId, JSON.stringify(newTripItems));

    // 更新畫面
    setTripItems(newTripItems);
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
    moveDetailToEmptyDate,
    moveDetailToNewPosition,
  };
};

export default useTripDetail;
