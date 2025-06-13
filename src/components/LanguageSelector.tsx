
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LanguageSelectorProps {
  onLanguageSelect: (language: 'en' | 'ja') => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelect }) => {
  return (
    <div className="min-h-screen bg-spot-surface flex items-center justify-center p-6">
      <Card className="w-full max-w-sm p-8 text-center bg-spot-surface-elevated shadow-spot-lg border-0 animate-scale-in">
        <div className="w-16 h-16 bg-spot-primary rounded-2xl flex items-center justify-center mx-auto mb-8">
          <span className="text-xl font-bold text-white">GO!</span>
        </div>
        
        <h1 className="text-2xl font-bold text-spot-primary mb-2">GO! SPOT</h1>
        <p className="text-spot-muted mb-10 text-sm">Choose your language / 言語を選択</p>
        
        <div className="space-y-3">
          <Button
            onClick={() => onLanguageSelect('en')}
            className="w-full h-12 text-base bg-spot-primary hover:bg-spot-primary/90 text-white border-0 rounded-xl font-medium shadow-spot-sm transition-all duration-200 hover:shadow-spot-md"
          >
            <span className="mr-3 text-lg">🇬🇧</span>
            English
          </Button>
          
          <Button
            onClick={() => onLanguageSelect('ja')}
            className="w-full h-12 text-base bg-spot-primary hover:bg-spot-primary/90 text-white border-0 rounded-xl font-medium shadow-spot-sm transition-all duration-200 hover:shadow-spot-md"
          >
            <span className="mr-3 text-lg">🇯🇵</span>
            日本語
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LanguageSelector;
