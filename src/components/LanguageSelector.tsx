
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LanguageSelectorProps {
  onLanguageSelect: (language: 'en' | 'ja') => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl text-white font-bold">GO!</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">GO! SPOT</h1>
        <p className="text-muted-foreground mb-8">Choose your language / 言語を選択</p>
        
        <div className="space-y-4">
          <Button
            onClick={() => onLanguageSelect('en')}
            className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all duration-200"
          >
            <span className="mr-3 text-xl">🇬🇧</span>
            English
          </Button>
          
          <Button
            onClick={() => onLanguageSelect('ja')}
            className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all duration-200"
          >
            <span className="mr-3 text-xl">🇯🇵</span>
            日本語
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LanguageSelector;
