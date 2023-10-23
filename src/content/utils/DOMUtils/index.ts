import { ISelectorConfig } from "../../types";

export default class DOMUtils {
    private selectors: ISelectorConfig;
    constructor() {
        this.selectors = this.getSelectors();
    }

    /**
     * Retrieves the CSS selectors based on the hostname for a specific platform.
     * @param {string} hostname - The hostname of the website.
     * @returns {object|null} An object containing CSS selectors or null if the hostname is not recognized.
     */
    getSelectors(): ISelectorConfig {
        const defaultConfig: ISelectorConfig = {
            chatContainer: "",
            messageAuthor: "",
            messageAuthorBadge: "",
            messageText: "",
            chatEmojis: "",
        };

        const configMap: { [key: string]: ISelectorConfig } = {
            "www.twitch.tv": {
                chatContainer: ".chat-scrollable-area__message-container",
                messageAuthor: ".chat-line__message .chat-author__display-name",
                messageAuthorBadge: ".chat-line__message .chat-badge",
                messageText:
                    ".chat-line__message [data-a-target='chat-line-message-body']",
                chatEmojis: ".chat-line__message img:not(.chat-badge)",
            },
            "www.youtube.com": {
                chatContainer:
                    "yt-live-chat-app yt-live-chat-renderer #chat-messages yt-live-chat-item-list-renderer #items",
                messageAuthor: "yt-live-chat-author-chip #author-name",
                messageAuthorBadge: ".yt-live-chat-app #author-photo",
                messageText: ".yt-live-chat-text-message-renderer #message",
                chatEmojis: ".emoji",
            },
            "kick.com": {
                chatContainer:
                    "#chatroom > div.relative.flex.grow.flex-col.overflow-hidden > div.overflow-y-scroll.py-3",
                messageAuthor:
                    "#chatroom .chat-message-identity .chat-entry-username",
                messageAuthorBadge: "",
                messageText: "#chatroom .chat-entry-content",
                chatEmojis: "",
            },
        };

        return configMap[window.location.hostname] || defaultConfig;
    }

    getChatContainer() {
        if (!this.selectors.chatContainer) {
            return null;
        }

        return document.querySelector(this.selectors.chatContainer);
    }

    getMessageText(node: Element): string {
        if (!this.selectors.messageText) {
            return "";
        }

        const selectedNode = node.querySelector(
            this.selectors.messageText
        ) as HTMLElement;

        if (!selectedNode) {
            return "";
        }

        return selectedNode.innerText || "";
    }

    getMessageEmojis(node: Element) {
        if (!this.selectors.messageText) {
            return [];
        }

        return Array.from(
            new Set(
                Array.from(
                    node.querySelectorAll(
                        this.selectors.chatEmojis
                    ) as NodeListOf<HTMLImageElement>
                ).map((img) => img.src)
            )
        );
    }

    getMessageAuthor(node: Element) {
        if (!this.selectors.messageAuthor) {
            return "";
        }

        return (
            node.querySelector(this.selectors.messageAuthor)?.textContent || ""
        );
    }

    getMessageBadges(node: Element) {
        if (!this.selectors.messageAuthorBadge) {
            return [];
        }

        return Array.from(
            node.querySelectorAll(
                this.selectors.messageAuthorBadge
            ) as NodeListOf<HTMLImageElement>
        ).map((img) => img.src);
    }
}
