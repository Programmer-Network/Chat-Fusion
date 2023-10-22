import { IMessage } from "../../types";

export default class HTTPMessageService {
    public static postMessage(message: IMessage): Promise<Response> {
        return fetch("http://localhost:3000/api/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });
    }
}
