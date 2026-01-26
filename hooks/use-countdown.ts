import { useEffect, useState } from 'react';

export function useCountdown(
  initialTime: number | undefined,
  onComplete?: () => void
) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (initialTime === undefined) return;

    let currentTime = initialTime;

    setTimeout(() => {
      setTimeRemaining(currentTime);
    }, 0);

    const interval = setInterval(() => {
      currentTime -= 1;
      setTimeRemaining(currentTime);

      if (currentTime <= 0) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTime]); // onComplete volontairement omis pour éviter de relancer le countdown

  return timeRemaining;
}
