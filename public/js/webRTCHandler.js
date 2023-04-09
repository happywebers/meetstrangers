import * as wss from './wss.js';
import * as constants from './constant.js';
import * as ui from './ui.js';
import * as store from "./store.js";


let connectedUserDetails;
let peerConnection;

const defaultConstraints = {
    audio: true,
    video: true
}

const configuration = {
    iceServers: [
        {
            urls: "stun:stun.1.google.com:13902"
        },
    ],
};

export const getLocalPreview = () => {
    navigator.mediaDevices
        .getUserMedia(defaultConstraints)
        .then((stream) => {
            ui.updateLocalVideo(stream);
            store.setLocalStream(stream);
        })
        .catch((err) => {
            console.log("error occured when trying to get access")
            console.log(err);
        })
}


const createPeerConnection = () => {
    peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = (event) => {
        console.log('greeting ice candidates from stun server')
        if (event.candidate) {
            //sending ice candidates to other peer
        }
    }

    peerConnection.onconnectionstatechange = (event) => {
        if (peerConnection.connectionState === 'connected') {
            console.log('successfully connected with other peer');
        }
    }

    //receiving tracks
    const remoteStream = new MediaStream();
    store.setRemoteStream(remoteStream);
    ui.updateRemoteVideo(remoteStream);

    peerConnection.ontrack = (event) => {
        remoteStream.addTrack(event.track);
    }

    if (connectedUserDetails.callType = constants.callType.VIDEO_PERSONAL_CODE) {
        const localStream = store.getState().localStream;
        for (const track of localStream.getTracks()) {
            peerConnection.addTrack(track, localStream);
        }
    }
};


export const sendPreOffer = (callType, calleePersonalCode) => {
    connectedUserDetails = {
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
    createPeerConnection();
    // console.log('call accepted NEW BUG');
    sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
    // console.log(connectedUserDetails.callType);
    ui.showCallElements(connectedUserDetails.callType);


}

const rejectCallHandler = () => {
    console.log("call rejected")
    sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
}

const callingDailogRejectCallHandler = () => {
    console.log('rejecting the call');
    sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
}

const sendPreOfferAnswer = (preOfferAnswer) => {
    const data = {
        callerSocketId: connectedUserDetails.socketId,
        preOfferAnswer
    }
    ui.removeAllDialogs();
    wss.sendPreOfferAnswer(data);
}

export const handlePreOfferAnswer = (data) => {
    const { preOfferAnswer } = data;
    ui.removeAllDialogs();

    if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
        ui.showInfoDialog(preOfferAnswer);
        // show dialog that callee has not been found
    }

    if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
        ui.showInfoDialog(preOfferAnswer);
        // show dialog that callee is not able to connect
    }

    if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
        ui.showInfoDialog(preOfferAnswer);
        // show dialog that call is rejected by the callee
    }

    if (preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
        ui.showCallElements(connectedUserDetails.callType);
        createPeerConnection();
        sendWebRTCOffer();
    }
};

const sendWebRTCOffer = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    wss.sendDataUsingWebRTCSignaling({
        connectedUserDetails: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.OFFER,
        offer: offer,
    });
}

export const handleWebRTCOffer = (data) => {
    console.log('WebRTC offer came');
    console.log(data);
};