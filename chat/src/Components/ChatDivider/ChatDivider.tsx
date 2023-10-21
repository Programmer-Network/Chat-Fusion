import { FC } from "react";
import { IMessage } from "../../types";

export const ChatDivider: FC<{
  message: IMessage;
}> = ({ message }) => {
  const { platform } = message;

  return (
    <div className="w-100 border-b border-b-gray-700 text-center h-5 my-12">
      <span className="text-white text-xs mb-2 bg-indigo-700 p-2 uppercase">
        <b className="-tracking-tight">{platform}</b> reloaded
      </span>
    </div>
  );
};
