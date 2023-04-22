import LZRChannel from "./channel";
import LZRGuest from "./guest";
import LZRHost from "./host";

export type LZRHostCb = (host: LZRHost) => void;
export type LZRGuestCb = (guest: LZRGuest) => void;

class LzrRoom {
  public hosts: LZRHost[] = [];
  public guests: LZRGuest[] = [];

  //these are our holders for code that is waiting for a host to be created
  public hostSubs = new Map<string, LZRHostCb[]>();
  public guestSubs = new Map<string, LZRGuestCb[]>();

  private notifyHostSubs = (roomId: string) => {
    const host = this.getHost(roomId);
    if (this.hostSubs[roomId]) {
      this.hostSubs[roomId].forEach((cb) => cb(host));
      delete this.hostSubs[roomId];
    }
  };

  private notifyGuestSubs = (roomId: string) => {
    const guest = this.getGuest(roomId);
    if (this.guestSubs[roomId]) {
      this.guestSubs[roomId].forEach((cb) => cb(guest));
      delete this.guestSubs[roomId];
    }
  };

  public hostRoom = (name: string, roomId?: string) => {
    const host = new LZRHost(name, roomId);
    host.notifySubscribers = this.notifyHostSubs;
    host.setCloseHostFunc(() => this.closeHost(host.roomId));

    this.hosts.push(host);

    //if there are any subscribers waiting for a host to be created, call their callbacks
    if (this.hostSubs[host.id]) {
      this.hostSubs[host.id].forEach((cb) => cb(host));
      delete this.hostSubs[host.id];
    }

    return host;
  };

  public joinRoom = (name: string, roomId: string) => {
    const guest = new LZRGuest(name, roomId);
    guest.notifySubscribers = this.notifyGuestSubs;
    this.guests.push(guest);

    //if there are any subscribers waiting for a guest to be created, call their callbacks
    if (this.guestSubs[roomId]) {
      this.guestSubs[roomId].forEach((cb) => cb(guest));
      delete this.guestSubs[roomId];
    }

    return guest;
  };

  private closeHost = (roomId: string) => {
    const host = this.getHost(roomId);

    if (host) {
      //remove the host from the hosts array and close the room
      this.hosts = this.hosts.filter((h) => h.roomId !== roomId);
    }
  };

  private closeGuest = (roomId: string) => {
    const guest = this.getGuest(roomId);

    if (guest) {
      //remove the guest from the guests array and close the room
      this.guests = this.guests.filter((g) => g.roomId !== roomId);
    }
  };

  public getHost = (roomId: string) =>
    this.hosts.find((h) => h.roomId === roomId);
  public getGuest = (roomId: string) =>
    this.guests.find((g) => g.roomId === roomId);

  public waitForHost = (roomId: string, cb: LZRHostCb) => {
    const host = this.getHost(roomId);
    if (host) {
      cb(host);
    } else {
      if (!this.hostSubs[roomId]) {
        this.hostSubs[roomId] = [];
      }
      this.hostSubs[roomId].push(cb);
    }
  };

  public waitForGuest = (roomId: string, cb: LZRGuestCb) => {
    const guest = this.getGuest(roomId);
    if (guest && guest.isConnected) {
      cb(guest);
    } else {
      if (!this.guestSubs[roomId]) {
        this.guestSubs[roomId] = [];
      }
      this.guestSubs[roomId].push(cb);
    }
  };
}

const lzrRoom = new LzrRoom();

//export the functions that will be used by the rest of the app
const hostLzrRoom = lzrRoom.hostRoom;
const joinLzrRoom = lzrRoom.joinRoom;

const waitForLzrHost = lzrRoom.waitForHost;
const waitForLzrGuest = lzrRoom.waitForGuest;

const getLzrHost = lzrRoom.getHost;
const getLzrGuest = lzrRoom.getGuest;

export {
  hostLzrRoom,
  joinLzrRoom,
  getLzrHost,
  getLzrGuest,
  waitForLzrHost,
  waitForLzrGuest,
  LZRGuest,
  LZRHost,
  type LZRChannel,
};
