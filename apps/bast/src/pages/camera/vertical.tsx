import { waitForLZRRoom } from "@utils/rtc";
import { useEffect, useState } from "react";

export default function CameraOverlay() {
  const [followerCount, setFollowerCount] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    waitForLZRRoom("camera-vertical", (guest) => {
      const followChannel = guest.createChannel<number>("followCount");
      const viewerChannel = guest.createChannel<number>("viewerCount");

      followChannel.get((res) => {
        setFollowerCount(Number(res));
      });

      viewerChannel.get((res) => {
        setViewerCount(res);
      });
    });
  }, []);

  return (
    <div className="h-full w-full flex justify-center items-center relative overflow-hidden">
      <div className="absolute w-2/6 h-full z-10">
        <div className="absolute h-full w-full z-10 scale-[1.75] rotate-90">
          <video muted autoPlay loop playsInline className="h-full w-full ">
            <source src="/assets/camera/border.webm" type="video/webm" />
          </video>
        </div>

        <div className="absolute h-fit w-full z-1 scale-[1] bottom-[-225px]">
          <video muted autoPlay loop playsInline className="h-full w-full">
            <source src="/assets/camera/nameplate2.webm" type="video/webm" />
          </video>
        </div>

        <div className="relative h-full w-full z-0">
          <div className="flex items-center pl-10 pt-10">
            <video
              playsInline
              muted
              autoPlay
              loop
              style={{ width: 125, height: 125 }}
            >
              <source
                src="/assets/camera/followers-alpha.webm"
                type="video/webm"
              />
            </video>

            <div className="text-7xl font-bold text-white">{followerCount}</div>
          </div>

          <div className="flex items-center pl-10">
            <video
              playsInline
              muted
              autoPlay
              loop
              style={{ width: 125, height: 125 }}
            >
              <source
                src="/assets/camera/viewers-alpha.webm"
                type="video/webm"
              />
            </video>

            <div className="text-7xl font-bold text-white">{viewerCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
