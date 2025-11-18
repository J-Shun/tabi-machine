export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  country?: string;
  coverImage?: string;
}

export interface TripItem {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'meal' | 'attraction' | 'shopping' | 'transport' | 'other';
  notes?: string;
}
