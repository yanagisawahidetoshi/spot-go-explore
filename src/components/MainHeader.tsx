
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Settings, List } from 'lucide-react';

interface MainHeaderProps {
  isMapView: boolean;
  onToggleView: () => void;
  onShowLanguageSelector: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  isMapView,
  onToggleView,
  onShowLanguageSelector,
}) => {
  return (
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
            onClick={onToggleView}
            className="text-spot-secondary hover:text-spot-secondary/80 hover:bg-spot-secondary/10 h-9 w-9 p-0 rounded-lg"
          >
            {isMapView ? <List className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowLanguageSelector}
            className="text-spot-secondary hover:text-spot-secondary/80 hover:bg-spot-secondary/10 h-9 w-9 p-0 rounded-lg"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
