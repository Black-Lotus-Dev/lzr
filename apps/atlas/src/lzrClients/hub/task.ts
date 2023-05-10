import { getObsWs } from "../obs/client";
import OBSWebSocket, {
  OBSRequestTypes,
  OBSResponseTypes,
} from "obs-websocket-js";

export type ObsWsRequest = {
  type: "obs-ws";
  name: string;
  request: keyof OBSRequestTypes;
  data: OBSRequestTypes[keyof OBSRequestTypes];
};

export type UserScriptRequest = {
  type: "user-script";
  name: string;
  script: (prevTaskValues: any[], globalValues: any) => any;
};

type ObsTaskRequest = ObsWsRequest | UserScriptRequest;

class ObsTask {
  public name: string;
  public obsWs: () => OBSWebSocket = getObsWs;
  private task: ObsTaskRequest;

  constructor(name: string, task: ObsTaskRequest) {
    this.name = name;
    this.task = task;
  }

  async run() {
    //we might expand this to handle other edge cases like if the obsWs is not connected yet
    const obsWs = this.obsWs();

    switch (this.task.type) {
      case "obs-ws":
        const response = await obsWs.call(this.task.request, this.task.data);
        return response;
      case "user-script":
        break;
    }
  }
}

export default ObsTask;
