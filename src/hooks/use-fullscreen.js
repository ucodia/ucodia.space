import { useEffect } from "react";

export const useFullscreen = () => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.() ||
            document.documentElement.webkitRequestFullscreen?.() ||
            document.documentElement.mozRequestFullScreen?.() ||
            document.documentElement.msRequestFullscreen?.();
        } else {
          document.exitFullscreen?.() ||
            document.webkitExitFullscreen?.() ||
            document.mozCancelFullScreen?.() ||
            document.msExitFullscreen?.();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
