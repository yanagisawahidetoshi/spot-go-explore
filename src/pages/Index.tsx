
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Settings, List } from 'lucide-react';
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
      {/* Header */}
      <div className="relative z-10 bg-spot-surface-elevated border-b border-border/50 shadow-spot-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-spot-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-spot-primary">
              GO! SPOT
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMapView(!isMapView)}
              className="text-spot-secondary hover:text-spot-secondary/80 hover:bg-spot-secondary/10 h-9 w-9 p-0 rounded-lg"
            >
              {isMapView ? <List className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLanguageSelector(true)}
              className="text-spot-secondary hover:text-spot-secondary/80 hover:bg-spot-secondary/10 h-9 w-9 p-0 rounded-lg"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Permission Request */}
      {!hasPermission && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
          <Card className="mx-6 max-w-sm p-8 text-center bg-spot-surface-elevated shadow-spot-lg border-0 animate-scale-in">
            <div className="w-16 h-16 bg-spot-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-spot-primary mb-3">
              {currentLanguage === 'ja' ? '位置情報を許可' : 'Allow Location Access'}
            </h2>
            <p className="text-spot-muted mb-8 text-sm leading-relaxed">
              {currentLanguage === 'ja' 
                ? 'GO! SPOTは近くの観光スポットを表示するために位置情報が必要です'
                : 'GO! SPOT needs your location to show nearby tourist spots'
              }
            </p>
            <Button 
              onClick={handleGetLocation} 
              className="w-full h-12 bg-spot-primary hover:bg-spot-primary/90 text-white rounded-xl font-medium shadow-spot-sm"
            >
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
                <h2 className="text-2xl font-bold text-spot-primary mb-3">
                  {currentLanguage === 'ja' ? '近くのスポット' : 'Nearby Spots'}
                </h2>
                <p className="text-spot-muted">
                  {currentLanguage === 'ja' 
                    ? `${spots.length}件のスポットが見つかりました`
                    : `Found ${spots.length} spots nearby`
                  }
                </p>
              </div>
              
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4 animate-pulse bg-spot-surface-elevated border-0 shadow-spot-sm rounded-2xl">
                      <div className="flex space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-xl"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {spots.map((spot) => (
                    <Card 
                      key={spot.id} 
                      className="p-4 hover:shadow-spot-md transition-all duration-200 cursor-pointer bg-spot-surface-elevated border-0 shadow-spot-sm rounded-2xl animate-fade-in"
                      onClick={() => handleSpotSelect(spot)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-spot-primary/10 rounded-xl flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-spot-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-spot-primary mb-1 text-base">{spot.name}</h3>
                          <p className="text-sm text-spot-muted mb-3">{spot.category}</p>
                          <div className="flex items-center space-x-3">
                            <span className="text-xs bg-spot-primary/10 text-spot-primary px-3 py-1 rounded-full font-medium">
                              ⭐ {spot.rating}
                            </span>
                            <span className="text-xs text-spot-muted">
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
            <div className="text-center max-w-sm">
              <div className="w-24 h-24 bg-spot-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
                <MapPin className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-spot-primary mb-4">
                {currentLanguage === 'ja' ? 'GO! SPOTへようこそ' : 'Welcome to GO! SPOT'}
              </h2>
              <p className="text-spot-muted leading-relaxed">
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
