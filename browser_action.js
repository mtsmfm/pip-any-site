const togglePip = () => {
  chrome.runtime.sendMessage({}, (response) => {
    if (response.state) {
      document.getElementById('togglePipButton').innerHTML ='Stop PiP!';
    } else {
      document.getElementById('togglePipButton').innerHTML = 'Start PiP!';
    }
  });
}

document.getElementById('togglePipButton').onclick = togglePip;
