import { useState, useEffect } from 'react';
import { getDates } from '../../../helpers';

import type { Trip } from '../../../types';

interface TripItem {
  date: string;
  weekDay: string;
  items: Array<{
    id: string;
    time: string;
    title: string;
    location: string;
    type: string;
  }>;
}

const useTripDetail = ({ tripId }: { tripId: string }) => {
  const [tripName, setTripName] = useState<string>('');
  const [tripItems, setTripItems] = useState<TripItem[] | null>([]);

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
  };
};

export default useTripDetail;
