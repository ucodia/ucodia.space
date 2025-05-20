import { useNavigate } from "react-router-dom";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";

const UI_TIMEOUT = 2 * 1000;

const FullscreenOverlay = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showUI = useCallback(() => {
    setIsVisible(true);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      setIsVisible(false);
    }, UI_TIMEOUT);
    setTimeoutId(newTimeoutId);
  }, [timeoutId]);

  // show UI on mouse move or scroll
  useEffect(() => {
    window.addEventListener("mousemove", showUI);
    window.addEventListener("scroll", showUI);
    return () => {
      window.removeEventListener("mousemove", showUI);
      window.removeEventListener("scroll", showUI);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showUI, timeoutId]);

  return (
    <div
      className={`absolute bottom-2 right-2 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Button
        onClick={() => navigate("fullscreen")}
        variant="primary"
        size="icon"
        className="bg-gray-600 bg-opacity-50 rounded-full hover:bg-gray-500 transition-all"
      >
        <Maximize2 className="h-4 w-4 text-white" />
      </Button>
    </div>
  );
};

export default FullscreenOverlay;
