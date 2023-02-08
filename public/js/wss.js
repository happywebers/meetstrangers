import * as store from './store.js';
import * as ui from './ui.js';
import * as webRTCHandler from './webRTCHandler.js';

let socketIO = null;

export const registerSocketEvents = (socket) => {
    socket.on('connect', () => {
        socketIO = socket;

        console.log('connected to server from mainjs')
        store.setSocketId(socket.id);
        ui.updatePersonalCode(socket.id);
    });
    
    socket.on("pre-offer", (data) => {
        console.log("pre offer came");
        webRTCHandler.handlePreOffer(data);
    });
};


export const sendPreOffer = (data) => {
    socketIO.emit("pre-offer", data);
};

