
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
    if (rating >= 4.5) return 'bg-red-500';
    if (rating >= 4.0) return 'bg-yellow-500';
    return 'bg-spot-primary';
  };

  const getSpotLabel = (rating: number) => {
    if (rating >= 4.5) return language === 'ja' ? '必見' : 'Must-see';
    if (rating >= 4.0) return language === 'ja' ? '人気' : 'Popular';
    return language === 'ja' ? '穴場' : 'Hidden gem';
  };

  return (
    <div className="relative h-screen bg-spot-surface">
      {/* Map Container */}
      <div className="absolute inset-0 bg-gradient-to-br from-spot-primary/5 to-spot-secondary/5">
        {/* Mock map background with subtle grid */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }} />
        </div>

        {/* User location indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-4 h-4 bg-spot-primary rounded-full border-2 border-white shadow-spot-md animate-pulse" />
            <div className="absolute -inset-3 border-2 border-spot-primary/40 rounded-full animate-ping opacity-75" />
          </div>
        </div>

        {/* Tourist spots */}
        {!loading && spots.map((spot, index) => {
          const angle = (index * 60) + Math.random() * 40;
          const distance = 80 + Math.random() * 60;
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
                <div className={`w-8 h-8 ${getSpotColor(spot.rating)} rounded-full border-2 border-white shadow-spot-md flex items-center justify-center hover:scale-110 transition-transform duration-200`}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                
                {/* Tooltip */}
                <Card className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 min-w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-spot-surface-elevated border-0 shadow-spot-lg rounded-xl">
                  <div className="text-sm font-semibold text-spot-primary">{spot.name}</div>
                  <div className="text-xs text-spot-muted mt-1">{getSpotLabel(spot.rating)}</div>
                </Card>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-spot-surface/80 backdrop-blur-sm flex items-center justify-center">
          <Card className="p-8 text-center bg-spot-surface-elevated border-0 shadow-spot-lg rounded-2xl">
            <div className="w-8 h-8 border-4 border-spot-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-spot-muted">
              {language === 'ja' ? 'スポットを検索中...' : 'Finding nearby spots...'}
            </p>
          </Card>
        </div>
      )}

      {/* Legend */}
      <Card className="absolute top-4 right-4 p-4 space-y-3 bg-spot-surface-elevated border-0 shadow-spot-md rounded-xl">
        <div className="text-xs font-semibold text-spot-primary mb-3">
          {language === 'ja' ? '凡例' : 'Legend'}
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-xs text-spot-secondary">{language === 'ja' ? '必見 (4.5+)' : 'Must-see (4.5+)'}</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-xs text-spot-secondary">{language === 'ja' ? '人気 (4.0+)' : 'Popular (4.0+)'}</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-spot-primary rounded-full" />
          <span className="text-xs text-spot-secondary">{language === 'ja' ? '穴場' : 'Hidden gems'}</span>
        </div>
      </Card>

      {/* Spot count */}
      {!loading && (
        <Card className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-3 bg-spot-surface-elevated border-0 shadow-spot-md rounded-xl">
          <span className="text-sm font-semibold text-spot-primary">
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
