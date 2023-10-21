import { FC } from "react";
import { IMessage } from "../../types";
import classNames from "classnames";
import { SaveIcon } from "../../assets/Icons/Save";

export const Message: FC<{
  message: IMessage;
  onMessageClick: (message: IMessage) => void;
  focusedMessage: IMessage | null;
}> = ({ message, focusedMessage, onMessageClick }) => {
  const { content, author, badges } = message;

  const handleSaveMessage = (message: IMessage) => {
    fetch("http://localhost:3000/api/save-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  return (
    <div
      onClick={() => onMessageClick(message)}
      className={classNames(
        "flex flex-col cursor-pointer relative border-l-4 border-dotted border-gray-500 px-4 py-2",
        {
          "px-16 py-16 w-4/12 border-8 border-l-8":
            focusedMessage && focusedMessage.id === message.id,
          hidden: focusedMessage && focusedMessage.id !== message.id,
          "border-indigo-700": message.platform === "twitch",
          "border-rose-700": message.platform === "youtube",
          "border-green-700": message.platform === "kick",
        }
      )}
    >
      <div
        className={classNames("flex items-center gap-2", {
          "flex-col !items-start !justify-start p-4": focusedMessage,
        })}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleSaveMessage(message);
          }}
        >
          <div
            className={classNames({
              "text-indigo-700 hover:text-indigo-500":
                message.platform === "twitch",
              "text-rose-700 hover:text-rose-500":
                message.platform === "youtube",
              "text-green-700 hover:text-green-500":
                message.platform === "kick",
            })}
          >
            <SaveIcon
              className={classNames("w-4", {
                "!w-8": focusedMessage,
              })}
            />
          </div>
        </div>
        <div
          className={classNames(
            "font-bold flex items-center gap-2 justify-center text-xl",
            {
              "!text-4xl uppercase italic tracking-tight":
                focusedMessage && focusedMessage.id === message.id,
              "text-indigo-700": message.platform === "twitch",
              "text-rose-700": message.platform === "youtube",
              "text-green-700": message.platform === "kick",
            }
          )}
        >
          <span>
            {badges?.length > 0 &&
              badges?.map((badge) => {
                return (
                  <img
                    className="inline-block w-8 h-8 p-1"
                    src={badge}
                    alt="badge"
                  />
                );
              })}
          </span>

          {author}
        </div>
        <div
          className={classNames(
            "text-gray-300 text-2xl flex items-center gap-2",
            {
              "text-gray-500 text-4xl":
                focusedMessage && focusedMessage.id === message.id,
            }
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
};
