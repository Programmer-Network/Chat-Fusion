import io, { Socket } from "socket.io-client";
import { IMessage, SocketType } from "../../types";

class SocketUtils {
    socket: Socket;
    socketType: SocketType;
    keepAliveIntervalId: ReturnType<typeof setInterval> | null = null;
    keepAliveIntervalSeconds: number = 20;

    constructor(options: {
        socketServer: string;
        socketType: SocketType;
        transports?: string[];
    }) {
        const { socketServer, socketType, transports } = options;

        this.socket = io(socketServer, {
            transports,
        });

        this.socketType = socketType;
        this.addListeners();
    }

    private addListeners = () => {
        this.onConnect();
        this.onDisconnect();
        this.onError();
    };

    private keepAlive = () => {
        this.clearKeepAlive();
        this.keepAliveIntervalId = setInterval(() => {
            if (!this.socket) {
                return;
            }

            this.socket.emit("keepalive");
        }, this.keepAliveIntervalSeconds * 1000);
    };

    private clearKeepAlive = () => {
        if (!this.keepAliveIntervalId) {
            return;
        }

        clearInterval(this.keepAliveIntervalId);
        this.keepAliveIntervalId = null;
    };

    private onConnect = () => {
        this.socket.on("connect", () => {
            this.keepAlive();
            this.socket.emit("register", this.socketType);
        });
    };

    private onError = () => {
        this.socket.on("connect_error", (error) => {
            console.log("Connect Error:", error);
        });
    };

    public sendMessageFromBackgroundScript = (message: IMessage) => {
        this.socket.emit("message", message);
    };

    public sendMessageFromUI = (message: string): void => {
        this.socket.emit("message", {
            content: message,
        });
    };

    public onMessage(callback: (message: IMessage) => void): void {
        this.socket.on("message", callback);
    }

    private onDisconnect = () => {
        this.socket.on("disconnect", () => {
            this.clearKeepAlive();
        });
    };

    public disconnect = (): void => {
        this.socket.off("connect");
        this.socket.off("connect_error");
        this.socket.off("message");
        this.socket.disconnect();
    };
}

export default SocketUtils;
