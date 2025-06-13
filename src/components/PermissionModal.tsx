
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface PermissionModalProps {
  currentLanguage: 'en' | 'ja';
  onRequestPermission: () => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  currentLanguage,
  onRequestPermission,
}) => {
  return (
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
          onClick={onRequestPermission} 
          className="w-full h-12 bg-spot-primary hover:bg-spot-primary/90 text-white rounded-xl font-medium shadow-spot-sm"
        >
          {currentLanguage === 'ja' ? '位置情報を許可' : 'Allow Location'}
        </Button>
      </Card>
    </div>
  );
};

export default PermissionModal;
