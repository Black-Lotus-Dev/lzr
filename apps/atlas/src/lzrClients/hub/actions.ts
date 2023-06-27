import { obsClient } from "../obs/client";

function ToggleCameraHDisplay(shouldShow: boolean) {
  obsClient.obsWs.call("SetSourceFilterEnabled", {
    sourceName: "Camera-H", // the name of the Text source
    filterName: shouldShow ? "Show" : "Hide",
    filterEnabled: true,
  });
}

function ToggleCameraVDisplay(shouldShow: boolean) {
  obsClient.obsWs.call("SetSourceFilterEnabled", {
    sourceName: "Camera-V", // the name of the Text source
    filterName: shouldShow ? "Show" : "Hide",
    filterEnabled: true,
  });
}

export async function SwitchToHorizontalCamera() {
  const filterRes = await obsClient.obsWs.call("GetSourceFilter", {
    sourceName: "Camera-H", // the name of the Text source
    filterName: "isHidden",
  });

  const isFilterEnabled = filterRes.filterEnabled;

  if (isFilterEnabled) {
    ToggleCameraHDisplay(true);
    ToggleCameraVDisplay(false);
  }
}

export async function SwitchToVerticalCamera() {
  const filterRes = await obsClient.obsWs.call("GetSourceFilter", {
    sourceName: "Camera-V", // the name of the Text source
    filterName: "isHidden",
  });

  const isFilterEnabled = filterRes.filterEnabled;

  if (isFilterEnabled) {
    ToggleCameraVDisplay(true);
    ToggleCameraHDisplay(false);
  }
}

export function HubEventHandler(event, data) {
  console.log("HubEventHandler", event, data);
}
