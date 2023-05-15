import _ from "lodash";
import { LZRChannel } from "@black-lotus-dev/ggpo";

import generationJson from "./genNameList.json";
import pokemon from "./pkList.json";
import types from "./typesList.json";
import { waitForLzrRoom } from "@/utils/rtc";

type WTPProps =
  | {
      event: "start";
      data: WTPGameStart;
    }
  | {
      event: "end";
      data: WTPGameEnd;
    };

interface WTPGameStart {
  pokemon: {
    name: string;
    image: string;
    types: string[];
  };
  gen: string;
}

interface WTPGameEnd {
  winners: string[];
}

export function startWtpGame() {
  waitForLzrRoom("wtp-game", (host) => {
    const wtpChannel = host.createChannel<WTPProps>("wtp-game");

    wtpChannel.get((res) => {
      console.log(res);
    });

    start(wtpChannel.send);
  });

  function start(sendWtpData: LZRChannel<WTPProps>["send"]) {
    const randomGen = _.sample(generationJson);

    const genSpecificPokemon = _.sample(
      pokemon.filter((p) => {
        return p.gen === randomGen;
      })
    );

    sendWtpData({
      event: "start",
      data: {
        pokemon: {
          name: genSpecificPokemon.name,
          image: genSpecificPokemon.img,
          types: genSpecificPokemon.types,
        },
        gen: randomGen,
      },
    });
  }
}
