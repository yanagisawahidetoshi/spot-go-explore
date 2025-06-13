
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Play, Pause, Settings, List } from 'lucide-react';
import MapView from '@/components/MapView';
import SpotDetails from '@/components/SpotDetails';
import LanguageSelector from '@/components/LanguageSelector';
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
    // Check if language was previously selected
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100">
      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md border-b border-blue-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              GO! SPOT
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMapView(!isMapView)}
              className="text-blue-600 hover:text-blue-700"
            >
              {isMapView ? <List className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLanguageSelector(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Permission Request */}
      {!hasPermission && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <Card className="mx-4 max-w-sm p-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-lg font-semibold mb-2">
              {currentLanguage === 'ja' ? '位置情報を許可' : 'Allow Location Access'}
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              {currentLanguage === 'ja' 
                ? 'GO! SPOTは近くの観光スポットを表示するために位置情報が必要です'
                : 'GO! SPOT needs your location to show nearby tourist spots'
              }
            </p>
            <Button onClick={handleGetLocation} className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600">
              {currentLanguage === 'ja' ? '位置情報を許可' : 'Allow Location'}
            </Button>
          </Card>
        </div>
      )}

      {/* Main Content */}
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
            <div className="p-4 space-y-4">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentLanguage === 'ja' ? '近くのスポット' : 'Nearby Spots'}
                </h2>
                <p className="text-muted-foreground">
                  {currentLanguage === 'ja' 
                    ? `${spots.length}件のスポットが見つかりました`
                    : `Found ${spots.length} spots nearby`
                  }
                </p>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4 animate-pulse">
                      <div className="flex space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {spots.map((spot) => (
                    <Card 
                      key={spot.id} 
                      className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500"
                      onClick={() => handleSpotSelect(spot)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{spot.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{spot.category}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              ⭐ {spot.rating}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {spot.distance}m away
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {currentLanguage === 'ja' ? 'GO! SPOTへようこそ' : 'Welcome to GO! SPOT'}
              </h2>
              <p className="text-muted-foreground max-w-md">
                {currentLanguage === 'ja' 
                  ? '音声ガイド付きで近くの観光スポットを発見しましょう'
                  : 'Discover nearby tourist spots with audio guidance'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
