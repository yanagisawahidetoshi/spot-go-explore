
import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { TouristSpot } from '@/types/spot';

interface SpotsListProps {
  spots: TouristSpot[];
  loading: boolean;
  currentLanguage: 'en' | 'ja';
  onSpotSelect: (spot: TouristSpot) => void;
}

const SpotsList: React.FC<SpotsListProps> = ({
  spots,
  loading,
  currentLanguage,
  onSpotSelect,
}) => {
  return (
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
              onClick={() => onSpotSelect(spot)}
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
  );
};

export default SpotsList;
