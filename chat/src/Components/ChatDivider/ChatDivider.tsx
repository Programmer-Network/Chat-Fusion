import { FC } from "react";
import { IMessage } from "../../types";


export const ChatDivider: FC<{
  message: IMessage;
}> = ({ message}) => {
  const { platform } = message;

  return (
    <div className="w-100 border-b border-b-red-700 text-center h-5 my-2">
        <span className=" text-white text-xl mb-2 bg-red-700">
        Chat Reload on: <b>{platform}</b>
        </span>
    </div>
  );
};
