import { setupCropStream } from "./setupCropStream";

let video: HTMLVideoElement | null = null;
let pip = false;

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const stream = await setupCropStream(request.streamId);

  video = document.createElement("video");
  video.srcObject = stream;

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
