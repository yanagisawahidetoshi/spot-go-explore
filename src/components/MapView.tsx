
import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { TouristSpot, UserLocation } from '@/types/spot';

interface MapViewProps {
  userLocation: UserLocation;
  spots: TouristSpot[];
  loading: boolean;
  onSpotSelect: (spot: TouristSpot) => void;
  language: 'en' | 'ja';
}

const MapView: React.FC<MapViewProps> = ({ 
  userLocation, 
  spots, 
  loading, 
  onSpotSelect, 
  language 
}) => {
  const getSpotColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-red-500'; // Must-see
    if (rating >= 4.0) return 'bg-yellow-500'; // Popular
    return 'bg-blue-500'; // Hidden gems
  };

  const getSpotLabel = (rating: number) => {
    if (rating >= 4.5) return language === 'ja' ? '必見' : 'Must-see';
    if (rating >= 4.0) return language === 'ja' ? '人気' : 'Popular';
    return language === 'ja' ? '穴場' : 'Hidden gem';
  };

  return (
    <div className="relative h-screen">
      {/* Map Container - In a real app, this would be react-native-maps */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-emerald-100">
        {/* Mock map background with grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* User location indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse" />
            <div className="absolute -inset-2 border-2 border-blue-400 rounded-full animate-ping opacity-75" />
          </div>
        </div>

        {/* Tourist spots */}
        {!loading && spots.map((spot, index) => {
          const angle = (index * 60) + Math.random() * 40; // Distribute around user
          const distance = 80 + Math.random() * 60; // Random positions around center
          const x = Math.cos(angle * Math.PI / 180) * distance;
          const y = Math.sin(angle * Math.PI / 180) * distance;
          
          return (
            <div
              key={spot.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer animate-fade-in"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
              onClick={() => onSpotSelect(spot)}
            >
              <div className="relative group">
                <div className={`w-8 h-8 ${getSpotColor(spot.rating)} rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform`}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                
                {/* Tooltip on hover */}
                <Card className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 min-w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="text-sm font-medium">{spot.name}</div>
                  <div className="text-xs text-muted-foreground">{getSpotLabel(spot.rating)}</div>
                </Card>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <Card className="p-6 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              {language === 'ja' ? 'スポットを検索中...' : 'Finding nearby spots...'}
            </p>
          </Card>
        </div>
      )}

      {/* Legend */}
      <Card className="absolute top-4 right-4 p-3 space-y-2">
        <div className="text-xs font-medium mb-2">
          {language === 'ja' ? '凡例' : 'Legend'}
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-xs">{language === 'ja' ? '必見 (4.5+)' : 'Must-see (4.5+)'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-xs">{language === 'ja' ? '人気 (4.0+)' : 'Popular (4.0+)'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-xs">{language === 'ja' ? '穴場' : 'Hidden gems'}</span>
        </div>
      </Card>

      {/* Spot count */}
      {!loading && (
        <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2">
          <span className="text-sm font-medium">
            {language === 'ja' 
              ? `${spots.length}件のスポット発見`
              : `${spots.length} spots found`
            }
          </span>
        </Card>
      )}
    </div>
  );
};

export default MapView;
