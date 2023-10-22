export interface IDOMUtils {
    getSelectors(): ISelectorConfig;
    getChatContainer(): Element | null;
    getMessageText(node: Element): string;
    getMessageEmojis(node: Element): string[];
    getMessageAuthor(node: Element): string;
    getMessageBadges(node: Element): string;
}

export interface IDateTimeUtils {
    getFriendlyTime(): string;
}

export interface IStringUtils {
    makeId(length: number): string;
    getPlatformNameByHostname(): string;
}

export interface IChromeUtils {
    setBadgeStatus(status: boolean): void;
}

export interface IWebRTCUtils {
    initWebRTCConnection(): Promise<RTCDataChannel>;
}

export interface ISelectorConfig {
    chatContainer: string;
    messageAuthor: string;
    messageAuthorBadge: string;
    messageText: string;
    chatEmojis: string;
}

export interface IMessage {
    sessionId: string;
    id: string;
    platform: string;
    timestamp: string;
    content: string;
    emojis: string[];
    author: string;
    badge: string;
}
