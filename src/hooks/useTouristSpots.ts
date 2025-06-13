
import { useState, useEffect } from 'react';
import { TouristSpot, UserLocation } from '@/types/spot';

// Mock data for demonstration
const mockSpots: TouristSpot[] = [
  {
    id: '1',
    name: 'Tokyo Tower',
    description: 'Iconic red and white tower offering panoramic city views',
    category: 'Landmark',
    rating: 4.5,
    photos: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400'],
    location: { latitude: 35.6586, longitude: 139.7454 },
    distance: 500,
    operatingHours: '9:00 AM - 11:00 PM',
    admissionFee: '¥1,200',
    historicalInfo: 'Built in 1958 as a broadcasting tower',
    interestingFacts: ['333 meters tall', 'Inspired by Eiffel Tower', 'Changes colors seasonally']
  },
  {
    id: '2',
    name: 'Senso-ji Temple',
    description: 'Ancient Buddhist temple with traditional architecture',
    category: 'Temple',
    rating: 4.7,
    photos: ['https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400'],
    location: { latitude: 35.7148, longitude: 139.7967 },
    distance: 800,
    operatingHours: '6:00 AM - 5:00 PM',
    admissionFee: 'Free',
    historicalInfo: 'Founded in 628 AD, oldest temple in Tokyo',
    interestingFacts: ['Famous Thunder Gate entrance', 'Traditional shopping street nearby']
  },
  {
    id: '3',
    name: 'Shibuya Crossing',
    description: 'World\'s busiest pedestrian crossing',
    category: 'Landmark',
    rating: 4.3,
    photos: ['https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400'],
    location: { latitude: 35.6598, longitude: 139.7006 },
    distance: 300,
    operatingHours: '24 hours',
    admissionFee: 'Free',
    historicalInfo: 'Became famous in the 1960s as Tokyo modernized',
    interestingFacts: ['Up to 3,000 people cross at once', 'Featured in many movies']
  }
];

export const useTouristSpots = (userLocation: UserLocation | null) => {
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userLocation) {
      fetchNearbySpots();
    }
  }, [userLocation]);

  const fetchNearbySpots = async () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would be an API call to Google Places or similar
      const spotsWithDistance = mockSpots.map(spot => ({
        ...spot,
        distance: Math.floor(Math.random() * 1000) + 100 // Random distance for demo
      }));
      
      setSpots(spotsWithDistance);
      setLoading(false);
    }, 1500);
  };

  return {
    spots,
    loading,
    refetch: fetchNearbySpots,
  };
};
