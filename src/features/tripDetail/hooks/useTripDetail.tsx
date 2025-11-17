import { useState, useEffect } from 'react';

import type { Trip } from '../../../types';

const useTripDetail = ({ tripId }: { tripId: string }) => {
  const [tripDetail, setTripDetail] = useState<Trip | null>(null);

  useEffect(() => {
    const trips = localStorage.getItem('trips');
    if (!trips) return;
    const parsedTrips: Trip[] = JSON.parse(trips);
    const foundTrip = parsedTrips.find((trip) => trip.id === tripId);

    if (!foundTrip) return;
    setTripDetail(foundTrip);
  }, [tripId]);

  return {
    tripDetail,
  };
};

export default useTripDetail;
