import * as React from "react";
import { createRoot } from "react-dom/client";

const domContainer = document.querySelector("#app")!;
const root = createRoot(domContainer);

export type Request =
  | {
      command: "start-page-pip";
      streamId: string;
    }
  | {
      command: "start-elem-pip";
      streamId: string;
    };

const startPip = (command: Request["command"]) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    if (tabId) {
      chrome.tabCapture.getMediaStreamId(
        { consumerTabId: tabId },
        (streamId) => {
          chrome.tabs.sendMessage(tabId, {
            command,
            streamId,
          } as Request);
        }
      );
    }
  });
};

const App: React.FC = () => {
  return (
    <div>
      <button onClick={() => startPip("start-page-pip")}>
        PiP entire page
      </button>
      <button onClick={() => startPip("start-elem-pip")}>
        PiP specific elem
      </button>
    </div>
  );
};

root.render(<App />);
