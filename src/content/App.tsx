import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ElementSelector } from "./ElementSelector";
import { setupCropStream } from "./setupCropStream";
import { Request } from "../popup";

export const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamId, setStreamId] = useState<string>();
  const [stream, setStream] = useState<MediaStream>();
  const [selectingElement, setSelectingElement] = useState(false);

  useEffect(() => {
    const listener = async ({ command, streamId }: Request) => {
      setStreamId(streamId);

      switch (command) {
        case "start-page-pip": {
          const stream = await setupCropStream(streamId);
          setStream(stream);
        }
        case "start-elem-pip": {
          setSelectingElement(true);
        }
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, [setStream]);

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
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <>
      {selectingElement && streamId && (
        <ElementSelector
          onSelect={async (rect) => {
            const stream = await setupCropStream(streamId, rect);
            setStream(stream);
            setSelectingElement(false);
          }}
        />
      )}
      <video ref={videoRef} style={{ display: "none" }} />
    </>
  );
};
