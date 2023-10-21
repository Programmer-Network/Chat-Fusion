export interface IMessage {
    id: string;
    platform: string;
    content: string;
    emojis: string[];
    author: string;
    badge: string[];
    authorColor: string;
}
