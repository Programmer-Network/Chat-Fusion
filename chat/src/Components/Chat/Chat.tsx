import { useEffect, useRef, FC } from "react";
import { IMessage } from "../../types";
import { Message } from "../Message";
import classNames from "classnames";

export const Chat: FC<{
  messages: IMessage[];
  focusedMessage: IMessage | null;
  setFocusedMessage: (message: IMessage | null) => void;
}> = ({ messages, focusedMessage, setFocusedMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleFocusMessage = (message: IMessage) => {
    setFocusedMessage(message.id === focusedMessage?.id ? null : message);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full p-12">
      <div
        className={classNames("flex flex-col gap-2", {
          "items-center justify-center h-screen w-screen overflow-hidden":
            focusedMessage,
        })}
      >
        {messages.map((message: IMessage, index: number) => (
          <Message
            key={index}
            message={message}
            focusedMessage={focusedMessage}
            onMessageClick={handleFocusMessage}
          />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
};
