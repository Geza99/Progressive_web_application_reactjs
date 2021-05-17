import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initPushNotifications, setupPwaInstallation } from './util';
import { initializeNotifications } from './notification';


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

  initializeNotifications()
.then(() => {
  initPushNotifications();
}).then(() => {
  setupPwaInstallation();
});
