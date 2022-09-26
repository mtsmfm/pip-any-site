interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const setupCropStream = async (streamId: string, rect?: Rect) => {
  const mandatory: any = {
    chromeMediaSource: "tab",
    chromeMediaSourceId: streamId,
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

  if (rect) {
    const [track] = stream.getTracks();
    const processor = new MediaStreamTrackProcessor({
      track: track as MediaStreamVideoTrack,
    });
    const { readable } = processor;

    const generator = new MediaStreamTrackGenerator({ kind: "video" });
    const { writable } = generator;

    readable
      .pipeThrough(
        new TransformStream({
          transform: (chunk, controller) => {
            const newFrame = new VideoFrame(chunk as any, {
              visibleRect: rect,
            });
            // const newFrame = new VideoFrame(chunk as any);
            controller.enqueue(newFrame);
            chunk.close();
          },
        })
      )
      .pipeTo(writable);

    return new MediaStream([generator]);
  } else {
    return stream;
  }
};
