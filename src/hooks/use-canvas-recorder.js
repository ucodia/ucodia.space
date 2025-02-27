import { useState, useCallback, useRef } from "react";

const mimeTypes = [
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
];

const currentTs = () =>
  new Date().toISOString().replace(/[-:]/g, "").replace("T", "_").slice(0, 15);

const useCanvasRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const recordedBlobsRef = useRef([]);
  const mediaRecorderRef = useRef(null);
  const recordingTypeRef = useRef(null);

  const startRecording = useCallback((canvas, fps = 60) => {
    const stream = canvas.captureStream(fps);

    // select the best mime type
    for (let i in mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeTypes[i])) {
        recordingTypeRef.current = mimeTypes[i];
        break;
      }
    }
    if (recordingTypeRef.current == null) {
      console.error("No supported type found for MediaRecorder");
      return;
    }

    // create the media recorder
    recordedBlobsRef.current = [];
    try {
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: recordingTypeRef.current,
        videoBitsPerSecond: 50000000000,
      });
    } catch (e) {
      console.error("Exception while creating MediaRecorder:", e);
      return;
    }
    mediaRecorderRef.current.ondataavailable = function (event) {
      if (event.data && event.data.size > 0) {
        recordedBlobsRef.current.push(event.data);
      }
    };

    // start the recording
    mediaRecorderRef.current.start(1000);
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(
    (filename = `recording-${currentTs()}.webm`) => {
      // stop the recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // create the file
      let file = new Blob(recordedBlobsRef.current, {
        type: recordingTypeRef.current,
      });

      // download the file
      const url = URL.createObjectURL(file);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(url);
    },
    []
  );

  return { isRecording, startRecording, stopRecording };
};

export default useCanvasRecorder;
