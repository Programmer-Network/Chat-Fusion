import { createContext, useState } from "react";
import { Chat } from "./Components/Chat";
import { useMessageListener } from "./Hooks/UseMessageListener";
import { IMessage } from "./types";
import classNames from "classnames";

export const LevelContext = createContext(null);

function App() {
  const messages = useMessageListener();
  const [focusedMessage, setFocusedMessage] = useState<IMessage | null>(null);

  return (
    <div
      className={classNames("bg-[#1b1f23]", {
        "items-center justify-center h-screen w-screen overflow-hidden":
          focusedMessage,
      })}
    >
      <div>
        <Chat
          messages={messages}
          focusedMessage={focusedMessage}
          setFocusedMessage={setFocusedMessage}
        />
      </div>
    </div>
  );
}

export default App;
