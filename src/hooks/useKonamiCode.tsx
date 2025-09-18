import { useEffect, useCallback, useState, useRef } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
  "Enter",
];

const DIRECTIONAL_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
];

export const useKonamiCode = (callback: () => void) => {
  const [, setKeys] = useState<string[]>([]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastInputRef = useRef<"key" | "touch" | null>(null);

  const resetKeys = useCallback(() => {
    setKeys([]);
  }, []);

  const performKeySequenceCheck = useCallback(
    (newKeys: string[]) => {
      let shouldReset = false;

      if (newKeys.length === KONAMI_CODE.length) {
        const matchesFull = KONAMI_CODE.every(
          (key, index) => key === newKeys[index]
        );
        if (matchesFull) {
          shouldReset = true;
        }
      }

      if (
        !shouldReset &&
        lastInputRef.current === "touch" &&
        newKeys.length >= DIRECTIONAL_CODE.length
      ) {
        const lastDirKeys = newKeys.slice(-DIRECTIONAL_CODE.length);
        const matchesDir = DIRECTIONAL_CODE.every(
          (key, index) => key === lastDirKeys[index]
        );
        if (matchesDir) {
          shouldReset = true;
        }
      }

      if (shouldReset) {
        callback();
        return [];
      }

      return newKeys;
    },
    [callback]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      lastInputRef.current = "key";
      setKeys((currentKeys) => {
        const newKeys = [...currentKeys, event.code];
        if (newKeys.length > KONAMI_CODE.length) {
          newKeys.splice(0, newKeys.length - KONAMI_CODE.length);
        }
        return performKeySequenceCheck(newKeys);
      });
    },
    [performKeySequenceCheck]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      const firstTouch = e.touches[0];
      touchStartRef.current = { x: firstTouch.clientX, y: firstTouch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const start = touchStartRef.current;
      if (!start || e.changedTouches.length === 0) return;

      const endTouch = e.changedTouches[0];
      const deltaX = endTouch.clientX - start.x;
      const deltaY = endTouch.clientY - start.y;

      if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) {
        touchStartRef.current = null;
        return;
      }

      let result: string;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        result = deltaX > 0 ? "ArrowRight" : "ArrowLeft";
      } else {
        result = deltaY > 0 ? "ArrowDown" : "ArrowUp";
      }

      touchStartRef.current = null;
      lastInputRef.current = "touch";
      setKeys((currentKeys) => {
        const newKeys = [...currentKeys, result];
        if (newKeys.length > KONAMI_CODE.length) {
          newKeys.splice(0, newKeys.length - KONAMI_CODE.length);
        }
        return performKeySequenceCheck(newKeys);
      });
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [performKeySequenceCheck]);

  return { resetKeys };
};
