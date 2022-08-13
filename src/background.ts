// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   const { readable, writable } = request;
//   console.log(request);
//   readable
//     .pipeThrough(
//       new TransformStream({
//         transform: (chunk, controller) => {
//           const newFrame = new VideoFrame(chunk, {
//             visibleRect: {
//               x: 320,
//               width: 640,
//               y: 180,
//               height: 360,
//             },
//           });
//           controller.enqueue(newFrame);
//           chunk.close();
//         },
//       })
//     )
//     .pipeTo(writable);
// });
