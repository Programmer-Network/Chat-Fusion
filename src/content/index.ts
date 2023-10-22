import ChatLoader from "./Chat";
import ChromeUtils from "./utils/ChromeUtils";
import DOMUtils from "./utils/DOMUtils";
import DateTimeUtils from "./utils/DateTime";
import StringUtils from "./utils/StringUtils";
import WebRTC from "./utils/WebRTC";

const domUtils = new DOMUtils();
const webRTCUtils = new WebRTC();
const chromeUtils = new ChromeUtils();
const stringUtils = new StringUtils();
const dateTimeUtils = new DateTimeUtils();

new ChatLoader(
    domUtils,
    webRTCUtils,
    chromeUtils,
    stringUtils,
    dateTimeUtils
).start();
