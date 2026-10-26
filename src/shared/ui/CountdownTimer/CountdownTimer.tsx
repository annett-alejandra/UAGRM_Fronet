import {
  useEffect,
  useState,
} from "react";

interface CountdownTimerProps {
  readonly expiresAt: number;
  readonly onExpire?: () => void;
}

export function CountdownTimer({
  expiresAt,
  onExpire,
}: CountdownTimerProps) {
  const [remainingSeconds, setRemainingSeconds] =
    useState(() =>
      Math.max(
        0,
        Math.ceil(
          (expiresAt - Date.now()) /
            1000
        )
      )
    );

  useEffect(() => {
    const intervalId =
      window.setInterval(() => {
        const remaining =
          Math.max(
            0,
            Math.ceil(
              (expiresAt -
                Date.now()) /
                1000
            )
          );

        setRemainingSeconds(
          remaining
        );

        if (remaining === 0) {
          window.clearInterval(
            intervalId
          );

          onExpire?.();
        }
      }, 1000);

    return () =>
      window.clearInterval(
        intervalId
      );
  }, [
    expiresAt,
    onExpire,
  ]);

  const minutes =
    Math.floor(
      remainingSeconds / 60
    );

  const seconds =
    remainingSeconds % 60;

  const formattedTime =
    `${minutes
      .toString()
      .padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        rounded-base
        border
        border-border
        bg-secondary
        px-4
        py-3
      "
      role="timer"
      aria-live="polite"
    >
      <span
        className="
          text-sm
          font-medium
          text-secondary-foreground
        "
      >
        Tiempo restante
      </span>

      <strong
        className="
          font-mono
          text-lg
          text-primary
        "
      >
        {formattedTime}
      </strong>
    </div>
  );
}