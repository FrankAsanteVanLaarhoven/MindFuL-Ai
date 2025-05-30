
import React from "react";

const weatherScenes: Record<string, string> = {
  "clear-day": "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
  "clear-night": "linear-gradient(135deg, #2d3436 0%, #636e72 100%)",
  "cloudy": "linear-gradient(135deg, #b2bec3 0%, #636e72 100%)",
  "rain": "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
  "snow": "linear-gradient(135deg, #ddd 0%, #74b9ff 100%)",
  "thunderstorm": "linear-gradient(135deg, #2d3436 0%, #636e72 100%)",
  "fog": "linear-gradient(135deg, #b2bec3 0%, #ddd 100%)",
  "default": "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
};

interface WeatherBackgroundProps {
  condition: string;
  description: string;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ condition, description }) => {
  const backgroundStyle = weatherScenes[condition] || weatherScenes.default;
  
  return (
    <>
      <div
        className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out"
        style={{
          background: backgroundStyle,
        }}
        aria-label={description}
      />
      {/* Animated particles for weather effects */}
      {condition === 'rain' && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-8 bg-white/30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}
      {condition === 'snow' && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
      <div className="fixed inset-0 bg-black/10 z-0" />
    </>
  );
};

export default WeatherBackground;
