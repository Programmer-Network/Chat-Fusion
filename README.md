# Chat Fusion

<p align="center">
  <img src="./assets/images/chat-fusion.png" style="width: 150px;">
</p>

Chat Fusion is a self-hosted solution designed to consolidate chat feeds from multiple platforms into a singular, unified interface. Built with a focus on customization and data privacy, the service does not rely on external services and can be easily tailored to your needs.

```mermaid
sequenceDiagram
  participant CE as Chrome Extension
  participant LA as Localhost API (Port 3000)
  participant Client

  loop MutationObserver
    CE->>+Twitch: Observe
    CE->>+Kick: Observe
    CE->>+YouTube: Observe
  end

  CE->>LA: POST observed chat data

  loop Interval Polling
    Client->>LA: GET observed chat data
    LA->>Client: Return aggregated chat data
  end
```

## How It Works

Under the hood, Chat Fusion employs a Chrome content script to inject code into the web pages of various chat platforms like Twitch, YouTube, and Kick. The script utilizes the `MutationObserver` API to actively monitor changes to the chat DOM elements.

Once a new chat message arrives, the script collects pertinent information—be it from Twitch, YouTube, or any other supported platform—and normalizes it into a standardized data structure.

```typescript
export interface IMessage {
  id: string;
  platform: string; // The platform where the message originates, e.g., 'Twitch'
  content: string; // The textual content of the chat message
  emojis: string[]; // Any emojis included in the message
  author: string; // The username of the person who sent the message
  badge: string; // A URL pointing to the badge or avatar of the author
}
```

## Why This Matters

The primary advantage is consistency. Regardless of the originating platform, each message is transformed into a common, predictable format. This ensures a seamless contract between the client and the API, facilitating easier integration and providing a streamlined user experience.

## Features

- **Full Customizability**: Change the appearance, behavior, or add new platforms as per your requirements.
- **Data Privacy**: Your data never leaves your server, ensuring complete privacy and security.
- **Universal API Contract**: The uniform `IMessage` structure simplifies client-side development, making it easier to extend features or integrate with other services.

By offering a consistent, user-friendly interface, Chat Fusion makes managing and participating in chats across multiple platforms simpler and more efficient than ever before.

## Setup

```bash
pnpm i
pnpm build # to build the chrome extension
```

You have to run the client (React) code and the API (fastify) separetly.

```bash
# In one terminal session
pnpm server-dev # to run an api in development mode with live reload using Nodemon

# In another
cd chat
pnpm dev # to run the chat react app
```

**Chrome Extension**

- In your Chrome Browser, head to `chrome://extensions`
- Enable `Developer mode` in the top right corner
- In the top left corner, click on `Load unpacked` and load this very repository into there. Essentially, `manifest.json`, `src` and `dist` are the extension part of this repository.

To ensure that the Chat Fusion Chrome Extension functions correctly, you'll need to open each platform chat in either a new tab or a separate window. This is essential because most streaming platforms, like YouTube, embed their chat interfaces within iframes. Due to browser security constraints, Chrome Content Scripts can only access the DOM of the parent page and not any embedded iframes.

Steps to Setup:

- Install the Chat Fusion Chrome Extension.
- Run the API and client.
- Open the chat interface of each streaming platform you're broadcasting to in a new tab or window.

By doing this, the content script from the Chrome Extension will have the necessary access to query and traverse the DOM of these chats. This enables it to locate the specific elements required for scraping chat data.
