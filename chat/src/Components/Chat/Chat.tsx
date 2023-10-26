import { useEffect, useRef, FC, useState } from "react";
import { Message } from "../Message";
import classNames from "classnames";
import { ReloadIcon } from "../../assets/Icons/Reload";
import { IMessage } from "../../../../types";

export const Chat: FC<{
    messages: IMessage[];
    sendMessage: (message: string) => void;
    focusedMessage: IMessage | null;
    setFocusedMessage: (message: IMessage | null) => void;
    onAction: (action: string, data: unknown) => void;
    filter: string;
}> = ({ messages, focusedMessage, setFocusedMessage, onAction, filter }) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [autoScroll, setAutoScroll] = useState<boolean>(true);

    const handleFocusMessage = (message: IMessage) => {
        setFocusedMessage(message.id === focusedMessage?.id ? null : message);
    };

    const scrollToBottom = () => {
        if (!messagesEndRef.current) {
            return;
        }

        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!autoScroll) {
            return;
        }

        scrollToBottom();
    }, [messages, autoScroll]);

    return (
        <>
            <div className="w-full p-12 flex-grow">
                <div
                    className={classNames("flex flex-col gap-2", {
                        "items-center justify-center h-screen w-screen overflow-hidden":
                            focusedMessage,
                    })}
                >
                    {messages.map((message: IMessage, index: number) => {
                        return (
                            <Message
                                key={index}
                                message={message}
                                filter={filter}
                                focusedMessage={focusedMessage}
                                onMessageClick={handleFocusMessage}
                                onAction={onAction}
                            />
                        );
                    })}
                    <div ref={messagesEndRef}></div>
                </div>
            </div>

            {!focusedMessage && (
                <div className="flex items-center justify-center pb-8">
                    <ReloadIcon
                        onClick={() => setAutoScroll(!autoScroll)}
                        className={classNames(
                            "w-12 text-gray-500 cursor-pointer",
                            {
                                "animate-spin !text-green-500": autoScroll,
                            }
                        )}
                    />
                </div>
            )}
        </>
    );
};
