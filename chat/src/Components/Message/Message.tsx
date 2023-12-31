import { FC, useState } from "react";
import { IMessage } from "../../types";
import classNames from "classnames";
import { SaveIcon } from "../../assets/Icons/Save";
import { FilterToggle } from "../FilterToggle/FilterToggle";
import { TwitchIcon } from "../../assets/Icons/Twitch";
import { YouTubeIcon } from "../../assets/Icons/YouTube";
import { KickIcon } from "../../assets/Icons/Kick";

const getIcon = (platform: string) => {
    switch (platform) {
        case "twitch":
            return <TwitchIcon className="text-indigo-700 w-8 mr-4" />;
        case "youtube":
            return <YouTubeIcon className="text-rose-700 w-9 mr-4" />;
        case "kick":
            return <KickIcon className="text-green-700 w-9 mr-4" />;
        default:
            return null;
    }
};

export const Message: FC<{
    message: IMessage;
    filter: string;
    onMessageClick: (message: IMessage) => void;
    onAction: (action: string, message: unknown) => void;
    focusedMessage: IMessage | null;
}> = ({ message, focusedMessage, onMessageClick, onAction, filter }) => {
    const { content, author, badges } = message;
    const [hoveredId, setHoveredId] = useState<string>("");

    const handleSaveMessage = (message: IMessage) => {
        fetch("http://localhost:3000/api/save-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });
    };

    const isHovered = hoveredId === message.id;

    return (
        <div
            onClick={() => onMessageClick(message)}
            onMouseOver={() => setHoveredId(message.id)}
            onMouseLeave={() => setHoveredId("")}
            className={classNames(
                "flex flex-col cursor-pointer relative border-gray-500 px-4 py-2",
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
                <span>{getIcon(message.platform)}</span>
                <div
                    style={{ color: message.authorColor }}
                    className={classNames(
                        "font-bold flex items-center gap-2 justify-center text-xl",
                        {
                            "!text-4xl uppercase italic tracking-tight":
                                focusedMessage &&
                                focusedMessage.id === message.id,
                        }
                    )}
                >
                    <div className="flex gap-1 items-center">
                        {badges?.map((badge, index) => (
                            <img key={index} src={badge} alt={badge} />
                        ))}
                    </div>
                    {author}
                    {isHovered && (
                        <div className="flex gap-1 items-center">
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveMessage(message);
                                }}
                            >
                                <div className={classNames({})}>
                                    <SaveIcon
                                        className={classNames("w-6", {
                                            "!w-8": focusedMessage,
                                        })}
                                    />
                                </div>
                            </div>
                            <FilterToggle
                                filter={filter}
                                onToggle={() => onAction("filter", message)}
                            />
                        </div>
                    )}
                </div>
                <div
                    className={classNames(
                        "text-gray-300 text-2xl flex items-center gap-2",
                        {
                            "text-gray-500 text-4xl":
                                focusedMessage &&
                                focusedMessage.id === message.id,
                        }
                    )}
                >
                    {content}
                </div>
            </div>
        </div>
    );
};
