
import React from 'react';
import { MapPin } from 'lucide-react';

interface WelcomeScreenProps {
  currentLanguage: 'en' | 'ja';
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ currentLanguage }) => {
  return (
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
  );
};

export default WelcomeScreen;
