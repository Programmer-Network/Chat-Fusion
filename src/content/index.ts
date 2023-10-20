interface ISelectorConfig {
  chatContainerSelector: string;
  chatMessageAuthorSelector: string;
  chatMessageAuthorBadgeSelector: string;
  chatMessageContentSelector: string;
  chatImageContainer: string;
}

/**
 * Retrieves the CSS selectors based on the hostname for a specific platform.
 * @param {string} hostname - The hostname of the website.
 * @returns {object|null} An object containing CSS selectors or null if the hostname is not recognized.
 */
function getSelectorsByPlatform(
  hostname: string
): ISelectorConfig | null | undefined {
  try {
    return {
      "www.twitch.tv": {
        chatContainerSelector: ".chat-scrollable-area__message-container",
        chatMessageAuthorSelector:
          ".chat-line__message .chat-author__display-name",
        chatMessageAuthorBadgeSelector: ".chat-line__message .chat-badge",
        chatMessageContentSelector: ".chat-line__message .text-fragment",
        chatImageContainer: ".chat-line__message img:not(.chat-badge)",
      },
      "www.youtube.com": {
        chatContainerSelector:
          "yt-live-chat-app yt-live-chat-renderer #chat-messages yt-live-chat-item-list-renderer #items",
        chatMessageAuthorSelector: "yt-live-chat-author-chip #author-name",
        chatMessageAuthorBadgeSelector: ".yt-live-chat-app #author-photo",
        chatMessageContentSelector:
          ".yt-live-chat-text-message-renderer #message",
        chatImageContainer: ".emoji",
      },
    }[hostname];
  } catch (_) {
    return null;
  }
}

/**
 * Maps the hostname to a human-readable platform name.
 * @param {string} hostname - The hostname of the website.
 * @returns {string|null} A string representing the platform name or null if the hostname is not recognized.
 */
const getPlatformNameByHostname = (
  hostname: string
): string | null | undefined => {
  try {
    return {
      "www.twitch.tv": "twitch",
      "www.youtube.com": "youtube",
    }[hostname];
  } catch (_) {
    return null;
  }
};

/**
 * Initializes the content script and sets up chat observers.
 */
const initContentScript = () => {
  const hostname = window.location.hostname;
  const platform = getPlatformNameByHostname(hostname);
  const config = getSelectorsByPlatform(hostname);
  if (!config) {
    return;
  }

  const chatObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.addedNodes.length) {
        return;
      }

      Array.from(mutation.addedNodes).forEach((chatNode) => {
        const isHTMLElement = chatNode instanceof Element;

        const content =
          config.chatMessageContentSelector && isHTMLElement
            ? chatNode.querySelector(config.chatMessageContentSelector)
                ?.textContent
            : "";

        const emojis: string[] =
          config.chatImageContainer && isHTMLElement
            ? Array.from(
                new Set(
                  Array.from(
                    chatNode.querySelectorAll(
                      config.chatImageContainer
                    ) as NodeListOf<HTMLImageElement>
                  ).map((img) => img.src)
                )
              )
            : [];

        const author =
          config.chatMessageAuthorSelector && isHTMLElement
            ? chatNode.querySelector(config.chatMessageAuthorSelector)
                ?.textContent
            : "";

        const badge =
          config.chatMessageAuthorBadgeSelector && isHTMLElement
            ? (
                chatNode.querySelector(
                  config.chatMessageAuthorBadgeSelector
                ) as HTMLImageElement
              )?.src
            : "";

        const data = {
          id: Math.random().toString(36).substr(2, 9),
          platform,
          content,
          emojis,
          author,
          badge,
        };

        if (!content) {
          return;
        }

        fetch("http://localhost:3000/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      });
    });
  });

  const chatElement = document.querySelector(config.chatContainerSelector);
  if (chatElement) {
    chatObserver.observe(chatElement, { childList: true });
  }
};

initContentScript();
