export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  country?: string;
  coverImage?: string;
}

export interface TripItem {
  date: string;
  weekDay: string;
  details: TripDetail[];
}

export interface TripDetail {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'meal' | 'attraction' | 'shopping' | 'transport' | 'other';
  notes?: string;
}
