import toast from "react-hot-toast";
import { getObsWs, obsClient } from "../obs/client";

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

  toast("Switching to Horizontal Camera");
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

export async function StartShroomTime() {
  toast("Starting Shroom Time");
}

export function HubEventHandler(event, data) {
  if (event === "obs-switch-camera") {
    if (data.camera === "H") SwitchToHorizontalCamera();
    else if (data.camera === "V") SwitchToVerticalCamera();
  }
}
