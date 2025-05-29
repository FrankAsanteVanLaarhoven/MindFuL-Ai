
import React from 'react';

interface EmojiReactionBarProps {
  onReact: (emoji: string) => void;
  reactions?: Record<string, number>;
}

const supportiveEmojis = [
  { emoji: '😊', label: 'Support' },
  { emoji: '💪', label: 'Strength' },
  { emoji: '🙏', label: 'Gratitude' },
  { emoji: '🌈', label: 'Hope' },
  { emoji: '🎉', label: 'Celebration' }
];

export const EmojiReactionBar: React.FC<EmojiReactionBarProps> = ({ onReact, reactions = {} }) => {
  return (
    <div className="flex gap-2 mt-3 flex-wrap">
      {supportiveEmojis.map(({ emoji, label }) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all hover:scale-105"
          aria-label={`React with ${label}`}
          title={label}
        >
          <span className="text-lg">{emoji}</span>
          {reactions[emoji] && (
            <span className="text-xs text-gray-600">{reactions[emoji]}</span>
          )}
        </button>
      ))}
    </div>
  );
};
