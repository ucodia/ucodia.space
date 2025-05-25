import { useState, useEffect, useRef } from "react";

export const useInteraction = (delay = 3000) => {
  const [isActive, setIsActive] = useState(true);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    setIsActive(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
    }, delay);
  };

  useEffect(() => {
    resetTimeout(); // Initial setup

    const handleUserInteraction = () => {
      resetTimeout();
    };

    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        // Request fullscreen
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.() ||
            document.documentElement.webkitRequestFullscreen?.() ||
            document.documentElement.mozRequestFullScreen?.() ||
            document.documentElement.msRequestFullscreen?.();
        } else {
          // Exit fullscreen
          document.exitFullscreen?.() ||
            document.webkitExitFullscreen?.() ||
            document.mozCancelFullScreen?.() ||
            document.msExitFullscreen?.();
        }
      }
      resetTimeout();
    };

    // Add event listeners
    window.addEventListener("mousemove", handleUserInteraction);
    window.addEventListener("mousedown", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);
    window.addEventListener("keydown", handleKeyDown);

    // Canvas-specific interactions
    const canvasElement = document.querySelector(".canvas-container canvas");
    if (canvasElement) {
      canvasElement.addEventListener("mousedown", handleUserInteraction);
      canvasElement.addEventListener("wheel", handleUserInteraction);
      canvasElement.addEventListener("touchstart", handleUserInteraction);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("mousedown", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("keydown", handleKeyDown);
      if (canvasElement) {
        canvasElement.removeEventListener("mousedown", handleUserInteraction);
        canvasElement.removeEventListener("wheel", handleUserInteraction);
        canvasElement.removeEventListener("touchstart", handleUserInteraction);
      }
    };
  }, [delay]);

  return isActive;
};
