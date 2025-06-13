
export interface TouristSpot {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  photos: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  operatingHours?: string;
  admissionFee?: string;
  historicalInfo?: string;
  interestingFacts?: string[];
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export type Language = 'en' | 'ja';
