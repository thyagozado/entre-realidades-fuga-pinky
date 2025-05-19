import audioManager from '../lib/audioManagerSingleton';
import { useEffect, useState, useRef } from 'react';

export default function useAudioManager() {
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showPercepcaoAchievement, setShowPercepcaoAchievement] = useState(false);

  const achievementShownRef = useRef(false);

  const playSound = (sound) => {
    // Implementation of playSound function
  };

  useEffect(() => {
    if (
      isChatActive &&
      chatHistory.some(msg => msg.sender === 'oracle') &&
      !showPercepcaoAchievement &&
      !achievementShownRef.current
    ) {
      setShowPercepcaoAchievement(true);
      achievementShownRef.current = true;
      playSound({
        filePath: '/assets/sounds/level_up_sfx.mp3',
        loop: false,
        volume: 1.0
      });
    }
  }, [isChatActive, chatHistory, showPercepcaoAchievement, playSound]);

  return audioManager;
}
