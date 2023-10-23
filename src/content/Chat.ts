import HTTPMessageService from "./Services/Messages";
import {
    IChromeUtils,
    IDOMUtils,
    IDateTimeUtils,
    IStringUtils,
    IWebRTCUtils,
} from "./types";

export default class ChatLoader {
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private retryCount = 0;
    private readonly maxRetries = 3;
    private readonly retryInterval = 1000;
    private readonly sessionId: string;

    constructor(
        private domUtils: IDOMUtils,
        private webRTCUtils: IWebRTCUtils,
        private chromeUtils: IChromeUtils,
        private stringUtils: IStringUtils,
        private dateTimeUtils: IDateTimeUtils
    ) {
        this.sessionId = this.stringUtils.makeId(10);
    }

    private isChatContainerAvailable(): boolean {
        return this.domUtils.getChatContainer() !== null;
    }

    private initializeChat(chatElement: Element): void {
        const chatObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (!mutation.addedNodes.length) {
                    return;
                }

                Array.from(mutation.addedNodes).forEach((chatNode) => {
                    if (!(chatNode instanceof Element)) {
                        return;
                    }

                    const content = this.domUtils.getMessageText(chatNode);
                    if (!content) {
                        return;
                    }

                    HTTPMessageService.postMessage({
                        sessionId: this.sessionId,
                        id: Math.random().toString(36).substr(2, 9),
                        timestamp: this.dateTimeUtils.getFriendlyTime(),
                        platform: this.stringUtils.getPlatformNameByHostname(),
                        content,
                        emojis: this.domUtils.getMessageEmojis(chatNode),
                        author: this.domUtils.getMessageAuthor(chatNode),
                        badges: this.domUtils.getMessageBadges(chatNode),
                    });
                });
            });
        });

        chatObserver.observe(chatElement, { childList: true });
        this.webRTCUtils.initWebRTCConnection();
    }

    public start(): void {
        this.intervalId = setInterval(() => {
            if (this.retryCount > this.maxRetries) {
                clearInterval(this.intervalId!);
                this.chromeUtils.setBadgeStatus(false);
                return;
            }

            if (this.isChatContainerAvailable()) {
                const chat = this.domUtils.getChatContainer();
                if (chat) {
                    this.initializeChat(chat);
                }

                clearInterval(this.intervalId!);
                this.chromeUtils.setBadgeStatus(true);
                return;
            }

            this.retryCount++;
        }, this.retryInterval);
    }
}
