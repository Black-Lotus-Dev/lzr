import { useEffect, useState } from "react";
import {
  StreamerBotClientState,
  StreamerBotClient,
  getStreamerBotClient,
} from "@/lzrClients/streamerbot/client";

const useStreamerBotClient = (): [
  StreamerBotClientState,
  StreamerBotClient
] => {
  const sbClient = getStreamerBotClient();
  const [clientState, setClientState] = useState<StreamerBotClientState>(
    sbClient.state
  );

  useEffect(() => {
    const handleStateChange = (newState: StreamerBotClientState) => {
      setClientState((prevState) => {
        const oldState = { ...prevState };
        const nextState = { ...newState };

        return {
          ...newState,
          previousState: oldState,
          currentState: nextState,
        };
      });
    };

    const subscription = sbClient.state$.subscribe(handleStateChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [sbClient]);

  return [clientState, sbClient];
};

export default useStreamerBotClient;
