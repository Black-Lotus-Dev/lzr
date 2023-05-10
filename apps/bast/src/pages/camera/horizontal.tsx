import { waitForLzrRoom } from "@utils/rtc";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CameraOverlay() {
  const [followerCount, setFollowerCount] = useState("0");
  const [viewerCount, setViewerCount] = useState("0");

  useEffect(() => {
    if (typeof window === "undefined") return;
    waitForLzrRoom("camera-horizontal", (guest) => {
      const followChannel = guest.createChannel<string>("followCount");
      const viewerChannel = guest.createChannel<number>("viewerCount");

      followChannel.get((res) => {
        console.log(res);
        setFollowerCount(res);
      });

      viewerChannel.get((res) => {
        viewerChannel.send(res);
      });

      followChannel.send("get");
    });
  }, []);

  return (
    <div className="h-full w-full flex justify-center items-center relative">
      <div className="h-5/6 w-5/6 flex flex-col relative">
        <div className="absolute h-full w-full z-10 scale-110">
          <video muted autoPlay loop playsInline className="h-full w-full">
            <source src="/assets/camera/border.webm" type="video/webm" />
          </video>
        </div>

        <div className="absolute h-full- w-full z-10">
          <video muted autoPlay loop playsInline className="h-full w-full">
            <source src="/assets/camera/nameplate2.webm" type="video/webm" />
          </video>
        </div>

        <div className="relative h-full w-full z-0">
          <div className="flex items-center pl-5 pt-5">
            <video
              playsInline
              muted
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            >
              <source
                src="/assets/camera/followers-alpha.webm"
                type="video/webm"
              />
            </video>

            <div className="text-8xl font-bold text-white">{followerCount}</div>
          </div>
          <div className="flex items-center pl-5 pt-0">
            <video
              playsInline
              muted
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            >
              <source
                src="/assets/camera/viewers-alpha.webm"
                type="video/webm"
              />
            </video>

            <div className="text-8xl font-bold text-white">{viewerCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
