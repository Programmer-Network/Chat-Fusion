import { FC } from "react";
import { IMessage } from "../../types";
import classNames from "classnames";
import { TwitchIcon } from "../../assets/Icons/Twitch";
import { YouTubeIcon } from "../../assets/Icons/YouTube";
import { KickIcon } from "../../assets/Icons/Kick";
import { SaveIcon } from "../../assets/Icons/Save";

export const Message: FC<{
  message: IMessage;
  onMessageClick: (message: IMessage) => void;
  focusedMessage: IMessage | null;
}> = ({ message, focusedMessage, onMessageClick }) => {
  const { platform, content, emojis, author } = message;
  const getIconByPlatform = (platform: string) => {
    switch (platform) {
      case "twitch":
        return <TwitchIcon />;
      case "youtube":
        return <YouTubeIcon />;
      case "kick":
        return <KickIcon />;
      default:
        return null;
    }
  };

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
        "mb-2 flex flex-col cursor-pointer relative border border-gray-500 p-8",
        {
          "px-16 py-16 w-4/12 border-2":
            focusedMessage && focusedMessage.id === message.id,
          hidden: focusedMessage && focusedMessage.id !== message.id,
          "border-indigo-700": message.platform === "twitch",
          "border-rose-700": message.platform === "youtube",
          "border-green-700": message.platform === "kick",
        }
      )}
    >
      <div className="flex items-center">
        <span
          className={classNames(
            "font-bold flex items-center gap-2 justify-center text-xl",
            {
              "text-6xl uppercase":
                focusedMessage && focusedMessage.id === message.id,
              "text-indigo-700": message.platform === "twitch",
              "text-rose-700": message.platform === "youtube",
              "text-green-700": message.platform === "kick",
            }
          )}
        >
          <span
            className={classNames("w-12", {
              "absolute top-3 left-3 w-12":
                focusedMessage && focusedMessage.id === message.id,
              "text-indigo-700": message.platform === "twitch",
              "text-rose-700": message.platform === "youtube",
              "text-green-700": message.platform === "kick",
            })}
          >
            {getIconByPlatform(platform)}
          </span>
          {author}
        </span>
      </div>
      <p
        className={classNames(
          "text-gray-300 text-2xl flex items-center gap-2",
          {
            "text-gray-500 text-4xl":
              focusedMessage && focusedMessage.id === message.id,
          }
        )}
      >
        {content}
        {emojis.map((emoji: string, index: number) => (
          <span key={index} className="flex gap-2 items-center">
            <img className="w-24" src={emoji} />
          </span>
        ))}
      </p>
      <div
        className="mx-auto absolute top-2 right-2"
        onClick={(e) => {
          e.stopPropagation();
          handleSaveMessage(message);
        }}
      >
        <div
          className={classNames({
            "text-indigo-700 hover:text-indigo-500":
              message.platform === "twitch",
            "text-rose-700 hover:text-rose-500": message.platform === "youtube",
            "text-green-700 hover:text-green-500": message.platform === "kick",
          })}
        >
          <SaveIcon className="w-8" />
        </div>
      </div>
    </div>
  );
};
