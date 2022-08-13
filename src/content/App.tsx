import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { setupCropStream } from "./setupCropStream";

interface Request {
  command: "start-pip";
  streamId: number;
}

export const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    const listener = async (request: Request) => {
      const stream = await setupCropStream(request.streamId);
      setStream(stream);
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      const onLeavePip = () => {
        stream.getTracks().forEach((t) => t.stop());
      };
      const onLoadedMetaData = () => {
        videoRef.current?.requestPictureInPicture();
        videoRef.current?.play();
      };

      videoRef.current.addEventListener("leavepictureinpicture", onLeavePip);
      videoRef.current.addEventListener("loadedmetadata", onLoadedMetaData);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener(
            "leavepictureinpicture",
            onLeavePip
          );
          videoRef.current.removeEventListener(
            "loadedmetadata",
            onLoadedMetaData
          );
        }
      };
    }
  }, [videoRef.current, stream]);

  useEffect(() => {
    if (stream) {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }
  }, [stream]);

  return (
    <>
      <video ref={videoRef} style={{ display: "none" }} />
    </>
  );
};
