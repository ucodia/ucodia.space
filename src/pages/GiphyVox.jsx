import React, { useState, useEffect } from "react";
import useSpeechToText from "@/hooks/useSpeechToText";
import giphy from "@/apis/giphy";
import Alert from "@/components/Alert";

export const meta = {
  name: "Giphy Vox",
  created: "2017-11-13",
};

const GiphyVox = () => {
  const [gifUrl, setGifUrl] = useState("");
  const [transcript, speech] = useSpeechToText();
  useEffect(() => {
    if (!transcript) return;

    async function fetchData() {
      const response = await giphy.search(transcript);
      if (response.data.length === 0) return;
      setGifUrl(response.data[0].images.original.url);
    }

    fetchData();
  }, [transcript]);

  if (!speech) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Alert title="Sorry!">
          <p>
            This experience requires speech recognition which is not available
            in your browser ¯\_(ツ)_/¯
          </p>
          <p>PS: You can try it on Chrome desktop.</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {gifUrl && (
        <img
          src={gifUrl}
          alt={`gif for keyword "${transcript}"`}
          className="w-full h-full object-contain"
        />
      )}
      <div
        className="
        p-6 text-5xl absolute bottom-0 w-full
        text-black bg-white bg-opacity-50 text-center
        z-[99]
      "
      >
        {transcript ? transcript : "say something..."}
      </div>
    </div>
  );
};

export default GiphyVox;
