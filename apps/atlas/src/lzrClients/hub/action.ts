import ObsTask, { ObsWsRequest } from "./task";
import { OBSRequestTypes } from "obs-websocket-js";

type OBSRequestDataTypes = {
  [key in keyof OBSRequestTypes]: OBSRequestTypes[key];
};
interface ObsWsTaskParams<T extends keyof OBSRequestTypes> {
  name: string;
  request: T;
  data: OBSRequestTypes[T];
}

class ObsAction {
  public name: string;
  private tasks: ObsTask[] = [];
  public isEnabled: boolean;

  public loadAction(action: string) {
    const save = JSON.parse(action);
    this.name = save.name;
    this.isEnabled = save.isEnabled;

    for (const task of save.tasks) {
      const obsTask = new ObsTask(task.name, task.task);
      this.addTask(obsTask);
    }

    return this;
  }

  getTasks() {
    return this.tasks.map((task) => task);
  }

  createObsWsTask<T extends keyof OBSRequestTypes>(
    name: string,
    request: T,
    data?: OBSRequestTypes[T]
  ) {
    const obsRequest: ObsWsRequest = {
      type: "obs-ws",
      name: "test",
      request,
      data,
    };
    const task = new ObsTask(name, obsRequest);
    this.addTask(task);
  }

  saveAction() {
    //this converts the properties of the class into a json string
    return JSON.stringify(this);
  }

  private addTask(task: ObsTask) {
    this.tasks.push(task);
  }

  public removeTask(task: ObsTask) {
    const index = this.tasks.indexOf(task);
    if (index > -1) {
      this.tasks.splice(index, 1);
    }
  }

  async run() {
    const results = [];
    for (const task of this.tasks) {
      const result = await task.run();
      results.push(result);
    }
    return results;
  }
}

export default ObsAction;
