import { useState, useEffect } from 'react';
import { createUUID } from '../../../helpers';

import type { Trip, TripDetail, TripItem } from '../../../types';

// 在尚未有 API 時，先使用 localStorage 處理
const useTripItem = ({ tripId }: { tripId: string }) => {
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

    // 將 Detail 的日期更新為目標日期
    movedItem.date = targetDate;

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

  const editTripDetail = (updatedDetail: TripDetail) => {
    if (!tripItems) return;

    // 更改資料，並且當日期有變動時，要將 Detail 放入對應日期的陣列中
    const newTripItems = tripItems.map((item) => {
      // 找到原本的日期，移除該 Detail
      if (
        item.details.some((detail) => detail.id === updatedDetail.id) &&
        item.date !== updatedDetail.date
      ) {
        return {
          ...item,
          details: item.details.filter(
            (detail) => detail.id !== updatedDetail.id
          ),
        };
      }

      // 找到更新後的日期，加入該 Detail
      if (item.date === updatedDetail.date) {
        return {
          ...item,
          details: item.details.some((detail) => detail.id === updatedDetail.id)
            ? item.details.map((detail) =>
                detail.id === updatedDetail.id ? updatedDetail : detail
              )
            : [...item.details, updatedDetail],
        };
      }

      return item;
    });

    // 更新本地存儲
    localStorage.setItem(tripId, JSON.stringify(newTripItems));

    // 更新畫面
    setTripItems(newTripItems);
  };

  const deleteTripDetail = (detail: TripDetail) => {
    if (!tripItems) return;

    const newTripItems = tripItems.map((item) => {
      if (item.date === detail.date) {
        return {
          ...item,
          details: item.details.filter((d) => d.id !== detail.id),
        };
      }
      return item;
    });

    // 更新本地存儲
    localStorage.setItem(tripId, JSON.stringify(newTripItems));

    // 更新畫面
    setTripItems(newTripItems);
  };

  useEffect(() => {
    // 從 trip 中抓出行程名稱
    const trips = localStorage.getItem('trips');
    if (!trips) return;
    const parsedTrips: Trip[] = JSON.parse(trips);
    const targetTrip = parsedTrips.find((trip) => trip.id === tripId);

    if (!targetTrip) return;
    setTripName(targetTrip.name);

    // 抓出詳細資料
    const tripIdData = localStorage.getItem(tripId);
    if (!tripIdData) return;
    const parsedTripItems = JSON.parse(tripIdData);
    setTripItems(parsedTripItems);
  }, [tripId]);

  return {
    tripName,
    tripItems,
    createTripItem,
    moveDetailToEmptyDate,
    moveDetailToNewPosition,
    editTripDetail,
    deleteTripDetail,
  };
};

export default useTripItem;
