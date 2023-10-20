import { useEffect, useRef, FC, useState } from "react";
import { IMessage } from "../../types";
import { Message } from "../Message";
import classNames from "classnames";
import { ChatDivider } from "../ChatDivider";

export const Chat: FC<{
  messages: IMessage[];
  focusedMessage: IMessage | null;
  setFocusedMessage: (message: IMessage | null) => void;
}> = ({ messages, focusedMessage, setFocusedMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [autoReload, setAutoReload] = useState<boolean>(true);
  const handleFocusMessage = (message: IMessage) => {
    setFocusedMessage(message.id === focusedMessage?.id ? null : message);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const mapMessages = () => {
    return messages.map((message: IMessage, index: number) => {
      if (message.author.toLocaleLowerCase() === "system") {
        return (
            <ChatDivider message={message} />
        );
      } else {
        return (
          <Message
            key={index}
            message={message}
            focusedMessage={focusedMessage}
            onMessageClick={handleFocusMessage}
          />
        );
      }
    });
  };

  useEffect(() => {
    if (autoReload) {
      scrollToBottom();
    }
  }, [messages, autoReload]);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-10 w-full text-center text-white bg-slate-700">
        Autoreload { autoReload ? (<span className="text-green-700">ON</span>) : (<span className="text-red-700">OFF</span>)} <button className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded" onClick={() => setAutoReload(!autoReload)}>Toggle</button>
      </div>
      <div className="w-full p-12 flex-grow">
        <div
          className={classNames("flex flex-col gap-2", {
            "items-center justify-center h-screen w-screen overflow-hidden":
              focusedMessage,
          })}
        >
          {mapMessages()}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
    </>
  );
};
