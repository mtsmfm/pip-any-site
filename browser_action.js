const startPip = () => {
  chrome.runtime.sendMessage({}, (_response) => { });
}

document.getElementById('startPipButton').onclick = startPip;
