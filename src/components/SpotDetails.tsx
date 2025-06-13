
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-blue-200">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-800 truncate">{spot.name}</h1>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={spot.photos[0]} 
          alt={spot.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-medium">{spot.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Basic Info */}
        <Card className="p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{spot.name}</h2>
          <p className="text-muted-foreground mb-3">{spot.category}</p>
          <p className="text-gray-700 leading-relaxed">{spot.description}</p>
        </Card>

        {/* Audio Player */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">
              {language === 'ja' ? '音声ガイド' : 'Audio Guide'}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSpeedChange}
              className="text-xs"
            >
              {playbackSpeed}x
            </Button>
          </div>
          
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={handlePlayPause}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" />
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Facts */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">
            {language === 'ja' ? '基本情報' : 'Quick Facts'}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {language === 'ja' ? '営業時間' : 'Hours'}:
              </span>
              <span className="font-medium">{spot.operatingHours}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {language === 'ja' ? '入場料' : 'Admission'}:
              </span>
              <span className="font-medium">{spot.admissionFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {language === 'ja' ? '距離' : 'Distance'}:
              </span>
              <span className="font-medium">{spot.distance}m</span>
            </div>
          </div>
        </Card>

        {/* Historical Info */}
        {spot.historicalInfo && (
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              {language === 'ja' ? '歴史' : 'History'}
            </h3>
            <p className="text-gray-700 leading-relaxed">{spot.historicalInfo}</p>
          </Card>
        )}

        {/* Interesting Facts */}
        {spot.interestingFacts && spot.interestingFacts.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              {language === 'ja' ? '豆知識' : 'Interesting Facts'}
            </h3>
            <ul className="space-y-2">
              {spot.interestingFacts.map((fact, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-700">{fact}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pb-8">
          <Button 
            onClick={handleGetDirections}
            className="h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {language === 'ja' ? '道順を取得' : 'Get Directions'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="h-12"
          >
            {language === 'ja' ? '共有' : 'Share'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;
