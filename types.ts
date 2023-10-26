import { FastifyInstance } from "fastify";
import { Server } from "socket.io";

export interface IDOMUtils {
    getSelectors(): ISelectorConfig;
    getChatContainer(): Element | null;
    getMessageText(node: Element): string;
    getMessageEmojis(node: Element): string[];
    getMessageAuthor(node: Element): string;
    getMessageBadges(node: Element): string[];
    getMessageInputRef(): Element | null;
    getChatSendButton(): Element | null;
    insertMessageValue(value: string): void;
    sendMessageToChat(message: string): void;
    pressSendButton(): void;
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
    badges: string[];
    authorColor?: string;
}

export enum SocketType {
    REACT = "SOCKET_TYPE_REACT",
    EXTENSION = "SOCKET_TYPE_EXTENSION",
}

export interface CustomFastifyInstance extends FastifyInstance {
    io?: Server;
}
