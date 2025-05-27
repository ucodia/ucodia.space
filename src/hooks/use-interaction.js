import { useState, useEffect, useRef } from "react";

const defaultEvents = [
  ["mousemove"],
  ["pointerdown", "pointerup"],
  ["mousedown", "mouseup"],
  ["keydown", "keyup"],
  ["touchstart", "touchend"],
];

export const useInteraction = (delay = 3000, events = defaultEvents) => {
  const [isActive, setIsActive] = useState(true);
  const timeoutRef = useRef(null);
  const eventStatesRef = useRef(new Array(events.length).fill(false));

  const resetTimeout = () => {
    setIsActive(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (!eventStatesRef.current.some((state) => state)) {
        setIsActive(false);
      }
    }, delay);
  };

  useEffect(() => {
    resetTimeout();

    const handlers = events
      .map((eventGroup, groupIndex) =>
        eventGroup.map((event, index) => ({
          event,
          handler: () => {
            // keep track of begin/end events state
            if (eventGroup.length > 1) {
              eventStatesRef.current[groupIndex] = index === 0;
            }
            resetTimeout();
          },
        }))
      )
      .flat();

    handlers.forEach(({ event, handler }) => {
      window.addEventListener(event, handler);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      handlers.forEach(({ event, handler }) => {
        window.removeEventListener(event, handler);
      });
    };
  }, [delay, events]);

  return isActive;
};
