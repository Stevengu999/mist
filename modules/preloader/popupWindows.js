/**
@module preloader PopupWindows
*/

require('./popupWindowsNoWeb3.js');
require('./include/web3CurrentProvider.js');
const Q = require('bluebird');
const web3Admin = require('../web3Admin.js');
const https = require('https');
const signer = require('../signer.js');
const ethereumNodeRemote = require('../ethereumNodeRemote.js');

require('./include/openPopup.js');



web3Admin.extend(window.web3);

// make variables globally accessable
window.Q = Q;
window.https = https;

window.getNonce = ethereumNodeRemote.web3.eth.getTransaction;
window.sign = signer.sign;

// Initialise the Redux store
window.store = require('./rendererStore');
