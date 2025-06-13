
import { useState, useEffect } from 'react';
import { UserLocation } from '@/types/spot';

export const useLocationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = () => {
    if ('geolocation' in navigator) {
      navigator.permissions.query({name: 'geolocation'}).then((result) => {
        if (result.state === 'granted') {
          setHasPermission(true);
          getCurrentLocation();
        } else {
          setHasPermission(false);
          setLoading(false);
        }
      }).catch(() => {
        // Fallback for older browsers
        setHasPermission(false);
        setLoading(false);
      });
    } else {
      setHasPermission(false);
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(location);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    }
  };

  const requestPermission = async () => {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        
        setUserLocation(location);
        setHasPermission(true);
        setLoading(false);
      } catch (error) {
        console.error('Permission denied:', error);
        setHasPermission(false);
        setLoading(false);
      }
    }
  };

  return {
    hasPermission,
    userLocation,
    loading,
    requestPermission,
  };
};
