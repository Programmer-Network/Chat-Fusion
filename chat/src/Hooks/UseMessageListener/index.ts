import { useEffect, useState } from "react";
import { IMessage } from "../../types";

export const useMessageListener = (): IMessage[] => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const fetchMessages = async () => {
    const res = await fetch("http://localhost:3000/api/messages");
    const data = await res.json();
    setMessages(data);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    } else {
      fetchMessages();
      intervalId = setInterval(fetchMessages, 1000);
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    handleVisibilityChange();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return messages;
};
