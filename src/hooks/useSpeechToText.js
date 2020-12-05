import { useEffect, useState } from "react";

const createSpeechRecognition = () => {
  const BrowserSpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition ||
      window.oSpeechRecognition);

  const recognition = BrowserSpeechRecognition
    ? new BrowserSpeechRecognition()
    : null;

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
  }

  return recognition;
};

const useSpeechToText = () => {
  const [speech] = useState(createSpeechRecognition());
  const [transcript, setTranscript] = useState("");
  useEffect(() => {
    if (speech) {
      speech.onresult = ({ results }) => {
        const firstResult = results[results.length - 1];
        if (firstResult.isFinal) {
          setTranscript(firstResult[0].transcript);
        }
      };
      speech.start();
    }
    return () => {
      if (speech) speech.stop();
    };
  }, [speech]);

  return [transcript, speech];
};

export default useSpeechToText;
