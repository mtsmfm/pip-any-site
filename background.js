const startPip = () => {
  chrome.tabCapture.capture({
    video: true,
    videoConstraints: {
      mandatory: {
        minWidth: 50,
        minHeight: 50,
        maxWidth: 1920,
        maxHeight: 1080,
        minFrameRate: 10,
        maxFrameRate: 60
      }
    }
  }, (stream) => {
    const video = document.createElement('video');
    video.srcObject = stream;

    let pip = false;

    video.addEventListener('enterpictureinpicture', () => {
      pip = true;
    });

    video.addEventListener('leavepictureinpicture', () => {
      pip = false;
      stream.getTracks().forEach(t => t.stop());
    });

    video.addEventListener('loadedmetadata', () => {
      video.requestPictureInPicture();
      video.play();
    });

    stream.addEventListener('inactive', () => {
      if (pip) {
        document.exitPictureInPicture();
      }
    });
  });
}

chrome.runtime.onMessage.addListener(() => {
  startPip();
});
