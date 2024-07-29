chrome.runtime.onMessage.addListener(async ({ tabId }: { tabId: number }) => {
  if (!document.pictureInPictureElement) {
    const { streamId }: { streamId: string } = await chrome.runtime.sendMessage(
      {
        action: "GET_STREAM_ID",
        tabId,
      }
    );

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        mandatory: {
          minWidth: 50,
          minHeight: 50,
          maxWidth: 1920,
          maxHeight: 1080,
          minFrameRate: 10,
          maxFrameRate: 60,
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId,
        },
      } as any,
      audio: false,
    });

    const video = document.createElement("video");
    video.srcObject = stream;

    video.addEventListener("loadedmetadata", () => {
      video.requestPictureInPicture();
      video.play();
    });

    video.addEventListener("leavepictureinpicture", () => {
      stream.getTracks().forEach((t) => t.stop());
    });
  } else {
    document.exitPictureInPicture();
  }
});
