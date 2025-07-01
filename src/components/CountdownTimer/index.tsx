import React, { useEffect, useState } from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';

type CountdownTimerProps = {
  initialTime: number;
  onTimerEnd?: () => void;
  style?: StyleProp<TextStyle>;
};

export default function CountdownTimer({ initialTime, onTimerEnd, style }: CountdownTimerProps) {
  const [timer, setTimer] = useState(initialTime);

  useEffect(() => {
    if (timer === 0) {
      if (onTimerEnd) {
        onTimerEnd();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, onTimerEnd]);

  return <Text style={style}>{`00:${timer.toString().padStart(2, '0')}`}</Text>;
}
