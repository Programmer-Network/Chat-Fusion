import { useEffect, useRef, FC, useState } from "react";
import { IMessage } from "../../types";
import { Message } from "../Message";
import classNames from "classnames";
import { ReloadIcon } from "../../assets/Icons/Reload";
import { SearchDialog } from "../SearchDialog";
import Fuse from "fuse.js";
import { NoChatResultIllustration } from "../../assets/Illustrations/NoChatResult";

export const Chat: FC<{
    messages: IMessage[];
    focusedMessage: IMessage | null;
    setFocusedMessage: (message: IMessage | null) => void;
    onAction: (action: string, data: unknown) => void;
    filter: string;
}> = ({ messages, focusedMessage, setFocusedMessage, onAction, filter }) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [autoScroll, setAutoScroll] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredMessages, setFilteredMessages] =
        useState<IMessage[]>(messages);
    const messagesToRender = searchTerm.trim() ? filteredMessages : messages;

    // This function is called whenever the search term changes in the SearchDialog
    const handleSearchChange = (newSearchTerm: string) => {
        setSearchTerm(newSearchTerm);

        // Fuse.js options; adjust as needed
        const options = {
            keys: ["content", "author", "platform"],
            threshold: 0.4,
            ignoreLocation: true,
        };

        const fuse = new Fuse(messages, options);
        const result = fuse.search(newSearchTerm);

        const matches = result.map(({ item }) => item); // Extract the matched items
        setFilteredMessages(matches); // Set filtered messages
    };

    const handleFocusMessage = (message: IMessage) => {
        setFocusedMessage(message.id === focusedMessage?.id ? null : message);
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
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
                    {messagesToRender.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-4 text-3xl text-gray-300">
                            It's quiet... too quiet. Try another search?
                            <div className="mt-12">
                                <NoChatResultIllustration />
                            </div>
                        </div>
                    ) : (
                        messagesToRender.map(
                            (message: IMessage, index: number) => (
                                <Message
                                    key={index}
                                    message={message}
                                    filter={filter}
                                    focusedMessage={focusedMessage}
                                    onMessageClick={handleFocusMessage}
                                    onAction={onAction}
                                />
                            )
                        )
                    )}
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
            <SearchDialog
                onSearchChange={handleSearchChange}
                searchTerm={searchTerm}
            />
        </>
    );
};
