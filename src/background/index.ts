chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.type !== "badge") {
        return;
    }

    setBadgeStatus(request.status);
    sendResponse({ status: request.status });
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
