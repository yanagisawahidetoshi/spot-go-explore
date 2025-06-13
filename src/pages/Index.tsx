
import React, { useState, useEffect } from 'react';
import MapView from '@/components/MapView';
import SpotDetails from '@/components/SpotDetails';
import LanguageSelector from '@/components/LanguageSelector';
import MainHeader from '@/components/MainHeader';
import PermissionModal from '@/components/PermissionModal';
import SpotsList from '@/components/SpotsList';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { useTouristSpots } from '@/hooks/useTouristSpots';
import { TouristSpot } from '@/types/spot';

const Index = () => {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ja'>('en');
  const [isMapView, setIsMapView] = useState(true);
  
  const { hasPermission, requestPermission, userLocation } = useLocationPermission();
  const { spots, loading } = useTouristSpots(userLocation);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('@go-spot-language');
    if (!savedLanguage) {
      setShowLanguageSelector(true);
    } else {
      setCurrentLanguage(savedLanguage as 'en' | 'ja');
    }
  }, []);

  const handleLanguageSelect = (lang: 'en' | 'ja') => {
    setCurrentLanguage(lang);
    localStorage.setItem('@go-spot-language', lang);
    setShowLanguageSelector(false);
  };

  const handleSpotSelect = (spot: TouristSpot) => {
    setSelectedSpot(spot);
  };

  const handleGetLocation = async () => {
    await requestPermission();
  };

  if (showLanguageSelector) {
    return <LanguageSelector onLanguageSelect={handleLanguageSelect} />;
  }

  if (selectedSpot) {
    return (
      <SpotDetails 
        spot={selectedSpot} 
        language={currentLanguage}
        onBack={() => setSelectedSpot(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-spot-surface">
      <MainHeader
        isMapView={isMapView}
        onToggleView={() => setIsMapView(!isMapView)}
        onShowLanguageSelector={() => setShowLanguageSelector(true)}
      />

      {!hasPermission && (
        <PermissionModal
          currentLanguage={currentLanguage}
          onRequestPermission={handleGetLocation}
        />
      )}

      <div className="flex-1">
        {hasPermission && userLocation ? (
          isMapView ? (
            <MapView 
              userLocation={userLocation}
              spots={spots}
              loading={loading}
              onSpotSelect={handleSpotSelect}
              language={currentLanguage}
            />
          ) : (
            <SpotsList
              spots={spots}
              loading={loading}
              currentLanguage={currentLanguage}
              onSpotSelect={handleSpotSelect}
            />
          )
        ) : (
          <WelcomeScreen currentLanguage={currentLanguage} />
        )}
      </div>
    </div>
  );
};

export default Index;
