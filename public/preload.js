// preload.js
const { ipcRenderer } = require('electron');

ipcRenderer.on('message', (event, text) => {
  console.log(text);
});

window.ipcRenderer = ipcRenderer;

window.ipcRenderer.removeEvents = events => {
  try {
    if (events && events.length > 0) {
      events.forEach(event => ipcRenderer.removeAllListeners(event));
    } else {
      ipcRenderer.removeAllListeners(events);
    }
  } catch (error) {
    console.error(error);
  }
};



