import { SocketType } from "../../types";
import SocketUtils from "../../utils/Socket";

const socket = new SocketUtils({
    socketServer: "http://localhost:3000",
    socketType: SocketType.EXTENSION,
    transports: ["websocket"],
});

socket.onMessage((message) => {
    chrome.tabs.query(
        {
            url: "https://www.twitch.tv/popout/programmer_network/chat?popout=",
        },
        (tabs) => {
            tabs.forEach((tab) => {
                const tabId = tab.id;
                if (!tabId) {
                    return;
                }

                chrome.tabs.sendMessage(tabId, {
                    type: "CHAT_FUSION_SEND_MESSAGE",
                    payload: message,
                });
            });
        }
    );
});

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.type === "CHAT_FUSION_CONTENT_SCRAPED") {
        socket.sendMessageFromBackgroundScript(request.payload);
    }

    if (request.type === "badge") {
        setBadgeStatus(request.status);
        sendResponse({ status: request.status });
    }
});

const setBadgeStatus = (status: boolean) => {
    if (status) {
        chrome.action.setBadgeText({ text: " " });
        chrome.action.setBadgeTextColor({ color: "#FFFFFF" });
        chrome.action.setBadgeBackgroundColor({ color: "#00FF00" });
        return;
    }

    chrome.action.setBadgeText({ text: " " });
    chrome.action.setBadgeTextColor({ color: "#FFFFFF" });
    chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
};
