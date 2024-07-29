chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id && tab.url) {
    if (tab.url.startsWith("chrome://")) {
      // noop
    } else {
      await chrome.tabs.sendMessage(tab.id!, { tabId: tab.id });
    }
  }
});

chrome.runtime.onMessage.addListener(
  (
    { action, tabId }: { action: "GET_STREAM_ID"; tabId: number },
    _sender,
    sendResponse
  ) => {
    switch (action) {
      case "GET_STREAM_ID": {
        chrome.tabCapture.getMediaStreamId(
          {
            targetTabId: tabId,
            consumerTabId: tabId,
          },
          (streamId) => {
            sendResponse({ streamId });
          }
        );
      }
    }

    return true;
  }
);
