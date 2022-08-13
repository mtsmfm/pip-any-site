import * as React from "react";
import { createRoot } from "react-dom/client";

const domContainer = document.querySelector("#app")!;
const root = createRoot(domContainer);

const startPip = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    if (tabId) {
      chrome.tabCapture.getMediaStreamId(
        { consumerTabId: tabId },
        (streamId) => {
          chrome.tabs.sendMessage(tabId, {
            command: "tab-media-stream",
            streamId: streamId,
          });
        }
      );
    }
  });
};

const App: React.FC = () => {
  return (
    <div>
      <button onClick={startPip}>Start pip</button>
    </div>
  );
};

root.render(<App />);
