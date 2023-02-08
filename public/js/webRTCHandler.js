import * as wss from './wss.js';
import * as constants from './constant.js';
import * as ui from './ui.js';

let connectedUserDetails;

export const sendPreOffer = (callType, calleePersonalCode) => {
    const connectedUserDetails = {
        callType,
        socketId: calleePersonalCode,
    };
    if (callType === constants.callType.CHAT_PERSONAL_CODE || constants.callType.VIDEO_PERSONAL_CODE) {
        const data = {
            callType,
            calleePersonalCode,
        }
        ui.showCallingDialog(callingDailogRejectCallHandler);
        wss.sendPreOffer(data);
    }
};

export const handlePreOffer = (data) => {
    const { callType, callerSocketId } = data;
    connectedUserDetails = {
        socketId: callerSocketId,
        callType,
    };
    if (callType === constants.callType.CHAT_PERSONAL_CODE || constants.callType.VIDEO_PERSONAL_CODE) {
        ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
    }
};

const acceptCallHandler = () => {
    console.log('call accepted');
}

const rejectCallHandler = () => {
    console.log("call rejected")
}

const callingDailogRejectCallHandler = () => {
    console.log('rejecting the call');
}