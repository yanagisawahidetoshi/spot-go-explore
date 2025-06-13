
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, Settings } from 'lucide-react';
import { TouristSpot } from '@/types/spot';

interface SpotDetailsProps {
  spot: TouristSpot;
  language: 'en' | 'ja';
  onBack: () => void;
}

const SpotDetails: React.FC<SpotDetailsProps> = ({ spot, language, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
    
    // Auto-play on mount
    setTimeout(() => {
      handlePlayPause();
    }, 500);

    return () => {
      if (currentUtterance && speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const getAudioText = () => {
    const texts = {
      en: `${spot.name}. ${spot.description}. This ${spot.category.toLowerCase()} has a rating of ${spot.rating} stars. Operating hours: ${spot.operatingHours}. Admission fee: ${spot.admissionFee}. ${spot.historicalInfo}. Here are some interesting facts: ${spot.interestingFacts?.join('. ')}.`,
      ja: `${spot.name}。${spot.description}。この${spot.category}の評価は${spot.rating}つ星です。営業時間：${spot.operatingHours}。入場料：${spot.admissionFee}。${spot.historicalInfo}。興味深い事実：${spot.interestingFacts?.join('。')}。`
    };
    return texts[language];
  };

  const handlePlayPause = () => {
    if (!speechSynthesis) return;

    if (isPlaying) {
      speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (currentUtterance && speechSynthesis.paused) {
        speechSynthesis.resume();
      } else {
        const utterance = new SpeechSynthesisUtterance(getAudioText());
        utterance.lang = language === 'ja' ? 'ja-JP' : 'en-US';
        utterance.rate = playbackSpeed;
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(100);
        };
        utterance.onpause = () => setIsPlaying(false);
        utterance.onresume = () => setIsPlaying(true);

        // Simulate progress (real implementation would need more sophisticated tracking)
        const duration = getAudioText().length * 60; // Rough estimate
        const interval = setInterval(() => {
          if (speechSynthesis.speaking && !speechSynthesis.paused) {
            setProgress(prev => {
              if (prev >= 100) {
                clearInterval(interval);
                return 100;
              }
              return prev + 1;
            });
          }
        }, duration);

        setCurrentUtterance(utterance);
        speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1, 1.25];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);

    if (currentUtterance && speechSynthesis) {
      speechSynthesis.cancel();
      setCurrentUtterance(null);
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.location.latitude},${spot.location.longitude}`;
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: spot.name,
        text: spot.description,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="h-10 w-10 p-0 rounded-full hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
          <div className="flex-1 mx-4">
            <h1 className="text-lg font-semibold text-gray-900 text-center truncate">
              {spot.name}
            </h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-72 bg-gray-100">
        <img 
          src={spot.photos[0]} 
          alt={spot.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="font-semibold text-gray-900">{spot.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 pb-8 space-y-8">
        {/* Basic Info */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold text-gray-900">{spot.name}</h2>
          </div>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
              {spot.category}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed text-base">{spot.description}</p>
        </div>

        {/* Audio Player */}
        <Card className="p-6 bg-gray-50 border-0 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'ja' ? '音声ガイド' : 'Audio Guide'}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSpeedChange}
              className="text-sm border-gray-200 hover:bg-white"
            >
              {playbackSpeed}×
            </Button>
          </div>
          
          <div className="space-y-6">
            <Progress value={progress} className="h-2 bg-gray-200" />
            
            <div className="flex items-center justify-center">
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-0.5" />
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Facts */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'ja' ? '基本情報' : 'Information'}
          </h3>
          <Card className="p-5 border-gray-100 rounded-xl">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <span className="text-gray-500 text-sm font-medium">
                  {language === 'ja' ? '営業時間' : 'Hours'}
                </span>
                <span className="text-gray-900 font-medium text-right flex-1 ml-4">
                  {spot.operatingHours}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-gray-500 text-sm font-medium">
                  {language === 'ja' ? '入場料' : 'Admission'}
                </span>
                <span className="text-gray-900 font-medium text-right flex-1 ml-4">
                  {spot.admissionFee}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-gray-500 text-sm font-medium">
                  {language === 'ja' ? '距離' : 'Distance'}
                </span>
                <span className="text-gray-900 font-medium text-right flex-1 ml-4">
                  {spot.distance}m
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Historical Info */}
        {spot.historicalInfo && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'ja' ? '歴史' : 'History'}
            </h3>
            <Card className="p-5 border-gray-100 rounded-xl">
              <p className="text-gray-600 leading-relaxed">{spot.historicalInfo}</p>
            </Card>
          </div>
        )}

        {/* Interesting Facts */}
        {spot.interestingFacts && spot.interestingFacts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'ja' ? '豆知識' : 'Did You Know?'}
            </h3>
            <Card className="p-5 border-gray-100 rounded-xl">
              <ul className="space-y-3">
                {spot.interestingFacts.map((fact, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5 flex-shrink-0" />
                    <span className="text-gray-600 leading-relaxed">{fact}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button 
            onClick={handleGetDirections}
            size="lg"
            className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
          >
            {language === 'ja' ? '道順' : 'Directions'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShare}
            size="lg"
            className="h-12 border-gray-200 text-gray-700 hover:bg-gray-50 font-medium rounded-xl"
          >
            {language === 'ja' ? '共有' : 'Share'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;
