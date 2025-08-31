import { useEffect, useState } from "react";
import { DateTime } from "luxon";

interface CountdownProps {
  expirestAt: DateTime;
}

export default function Countdown({ expirestAt }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");

  useEffect(() => {
    const updateCountdown = () => {
      const now = DateTime.utc(); // mismo zone que expirestAt
      const diffMs = expirestAt.toMillis() - now.toMillis();

      if (diffMs <= 0) {
        setTimeLeft("00:00:00");
        return false; // para cortar interval
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      );
      return true;
    };

    updateCountdown();

    // luego actualizaciones cada 1s
    const interval = setInterval(() => {
      if (!updateCountdown()) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expirestAt]);

  return (
    <p className="font-semibold text-sm text-red-400" title="Expiration">
      Exp: {timeLeft}
    </p>
  );
}
