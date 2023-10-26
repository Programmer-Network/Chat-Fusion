import { useEffect, useState } from "react";
import DummyMessageGenerator from "../../utils/faker";
import SocketUtils from "../../../../utils/Socket";
import { IMessage, SocketType } from "../../../../types";

const socket = new SocketUtils({
    socketServer: "http://localhost:3000",
    socketType: SocketType.REACT,
});

interface IUseMessageListener {
    messages: IMessage[];
    sendMessage: (message: string) => void;
}

const useMessageListenerProd = (): IUseMessageListener => {
    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        socket.onMessage((message: IMessage) => {
            setMessages([...messages, message]);
        });

        return () => {
            // TODO: fix
            // Cleanup: disconnect the socket when the component is unmounted
            // socket.disconnect();
        };
    }, [messages]);

    return { messages, sendMessage: socket.sendMessageFromUI };
};

const useMessageListenerDev = (): IUseMessageListener => {
    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newMessage = DummyMessageGenerator.generate();
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return { messages, sendMessage: () => {} };
};

export const useMessageListener =
    import.meta.env.VITE_USE_DUMMY_DATA === "true"
        ? useMessageListenerDev
        : useMessageListenerProd;
