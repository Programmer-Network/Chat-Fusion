export default class ChromeUtils {
  setBadgeStatus(status: boolean) {
    chrome.runtime.sendMessage({ status: status, type: "badge" });
  }
}
