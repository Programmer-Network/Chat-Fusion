import { createContext, useEffect, useState } from "react";
import { Chat } from "./Components/Chat";
import { useMessageListener } from "./Hooks/UseMessageListener";
import classNames from "classnames";
import { IMessage } from "../../types";

export const LevelContext = createContext(null);

function App() {
    const { messages, sendMessage } = useMessageListener();
    const [focusedMessage, setFocusedMessage] = useState<IMessage | null>(null);
    const [filter, setFilter] = useState("");
    const [filtered, setFiltered] = useState<IMessage[]>([]);

    const handleFilterUser = async (message: IMessage) => {
        setFilter(filter ? "" : message.author);
        setFiltered(
            filter
                ? []
                : messages.filter(
                      (message: IMessage) => message.author === filter
                  )
        );
    };

    const handleOnAction = (action: string, data: unknown) => {
        if (action === "filter") {
            handleFilterUser(data as IMessage);
        }
    };

    useEffect(() => {
        if (!filter) {
            setFiltered([]);
            return;
        }

        setFiltered(
            messages.filter((message: IMessage) => message.author === filter)
        );
    }, [messages, filter]);

    return (
        <div
            className={classNames("bg-[#1b1f23]", {
                "items-center justify-center h-screen w-screen overflow-hidden":
                    focusedMessage,
            })}
        >
            <div>
                <Chat
                    sendMessage={sendMessage}
                    messages={filtered.length ? filtered : messages}
                    focusedMessage={focusedMessage}
                    setFocusedMessage={setFocusedMessage}
                    onAction={handleOnAction}
                    filter={filter}
                />
            </div>
        </div>
    );
}

export default App;
