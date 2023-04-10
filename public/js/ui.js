import * as constants from './constant.js';
import * as elements from './elements.js';

export const updatePersonalCode = (personalCode) => {
    const personalCodeParagraph = document.getElementById("personal_code_paragraph");
    personalCodeParagraph.innerHTML = personalCode;
}

export const updateLocalVideo = (stream) => {
    const localVideo = document.getElementById("local_video");
    localVideo.srcObject = stream;

    localVideo.addEventListener("loadedmetadata", () => {
        localVideo.onplay();
    });
};

export const updateRemoteVideo = (stream) => {
    const remoteVideo = document.getElementById("remote_video");
    remoteVideo.srcObject = stream;
}

export const showIncomingCallDialog = (
    callType,
    acceptCallHandler,
    rejectCallHandler
) => {
    const callTypeInfo = callType === constants.callType.CHAT_PERSONAL_CODE ? 'Chat' : 'Video';
    const IncomingCallDialog = elements.getIncomingCallDialog(
        callTypeInfo,
        acceptCallHandler,
        rejectCallHandler
    );

    //removing all dialogs inside HTML dialog element
    const dialog = document.getElementById('dialog');
    dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
    dialog.appendChild(IncomingCallDialog);
};

export const showCallingDialog = (rejectCallHandler) => {
    const callingDialog = elements.getCallingDailog(rejectCallHandler);

    //removing all dialogs inside HTML dialog element
    const dialog = document.getElementById('dialog');
    dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());

    dialog.appendChild(callingDialog);
};

export const showInfoDialog = (preOfferAnswer) => {
    let infoDialog = null;

    if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
        infoDialog = elements.getInfoDialog(
            'Call rejected',
            'Callee rejected your call'
        )
    }

    if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
        infoDialog = elements.getInfoDialog(
            'Callee not found',
            'Please check your personal code'
        )
    }

    if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
        infoDialog = elements.getInfoDialog(
            'Call is not possible',
            'Probably callee is busy. Please try again later'
        )
    }

    if (infoDialog) {
        const dialog = document.getElementById("dialog");
        dialog.appendChild(infoDialog);
        setInterval(() => {
            removeAllDialogs();
        }, [4000]
        );
    }
}

export const removeAllDialogs = () => {
    const dialog = document.getElementById("dialog");
    dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
}

export const showCallElements = (callType) => {
    if (callType === constants.callType.CHAT_PERSONAL_CODE) {
        showChatCallElements();
    }

    if (callType === constants.callType.VIDEO_PERSONAL_CODE) {
        console.log("inside video chat LATEST");
        showVideoCallElements();
    }
};

const showChatCallElements = () => {
    const finishConnectionChatButtonContainer = document.getElementById(
        "finish_chat_button_container"
    );
    showElement(finishConnectionChatButtonContainer);

    const newMessageInput = document.getElementById("new_message");
    showElement(newMessageInput);
    //block panel
    disableDashboard();
};

const showVideoCallElements = () => {
    // console.log("BUUGG");
    const callButtons = document.getElementById("call_buttons");
    showElement(callButtons);

    // console.log("BUUGG2");

    const placeholder = document.getElementById("video_placeholder");
    hideElement(placeholder);

    // console.log("BUUGG3");

    const remoteVideo = document.getElementById("remote_video");
    // console.log("BUUGG4");
    showElement(remoteVideo);

    // console.log("BUUGG5");
    const newMessageInput = document.getElementById("new_message");
    showElement(newMessageInput);
    //block panel
    disableDashboard();
};

//ui call buttons
const micOnImgSrc = "./utils/images/mic.png";
const micOffImgSrc = "./utils/images/micOff.png";

export const updateMicButton = (micActive) => {
    const micButtonImage = document.getElementById("mic_button_image");
    micButtonImage.src = micActive ? micOffImgSrc : micOnImgSrc;
}


// ui helper functions

const enableDashboard = () => {
    const dashboardBlocker = document.getElementById("dashboard_blur");
    if (!dashboardBlocker.classList.contains("display_none")) {
        dashboardBlocker.classList.add("display_none");
    }
};

const disableDashboard = () => {
    const dashboardBlocker = document.getElementById("dashboard_blur");
    if (dashboardBlocker.classList.contains("display_none")) {
        dashboardBlocker.classList.remove("display_none");
    }
};

const hideElement = (element) => {
    if (!element.classList.contains("display_none")) {
        element.classList.add("display_none");
    }
};

const showElement = (element) => {
    if (element.classList.contains("display_none")) {
        element.classList.remove("display_none");
    }
};
