import { createRoot } from "react-dom/client";
import * as React from "react";

let video: HTMLVideoElement | null = null;
let pip = false;

const rootDom = document.createElement("div");
const shadowRoot = rootDom.attachShadow({ mode: "open" });

const root = createRoot(shadowRoot);
root.render(<div>Hello</div>);
document.body.append(rootDom);

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const mandatory: any = {
    chromeMediaSource: "tab",
    chromeMediaSourceId: request.streamId,
    minWidth: 50,
    minHeight: 50,
    maxWidth: 1920,
    maxHeight: 1080,
    minFrameRate: 10,
    maxFrameRate: 60,
  };

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      mandatory,
    },
  } as any);

  const [track] = stream.getTracks();
  const processor = new MediaStreamTrackProcessor({ track: track as any });
  const { readable } = processor;

  const generator = new MediaStreamTrackGenerator({ kind: "video" });
  const { writable } = generator;

  video = document.createElement("video");

  readable
    .pipeThrough(
      new TransformStream({
        transform: (chunk, controller) => {
          const newFrame = new VideoFrame(chunk as any, {
            visibleRect: {
              x: 0,
              width: chunk.codedWidth / 2,
              y: 100,
              height: 100,
            },
          });
          // const newFrame = new VideoFrame(chunk as any);
          controller.enqueue(newFrame);
          chunk.close();
        },
      })
    )
    .pipeTo(writable);

  video.srcObject = new MediaStream([generator]);

  video.addEventListener("enterpictureinpicture", () => {
    pip = true;
  });

  video.addEventListener("leavepictureinpicture", () => {
    pip = false;
    stream.getTracks().forEach((t) => t.stop());
  });

  video.addEventListener("loadedmetadata", () => {
    video!.requestPictureInPicture();
    video!.play();
  });

  stream.addEventListener("inactive", () => {
    if (pip) {
      document.exitPictureInPicture();
      video = null;
    }
  });
});
