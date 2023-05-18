import { type LZRHostCb, type LZRGuestCb } from "./types";
import LZRHost from "./host";
import LZRGuest from "./guest";

class LZRRoom {
  public hosts: LZRHost[] = [];
  public guests: LZRGuest[] = [];

  //these are our holders for code that is waiting for a host to be created
  public hostSubs = new Map<string, LZRHostCb[]>();
  public guestSubs = new Map<string, LZRGuestCb[]>();

  private notifyHostSubs = (roomId: string) => {
    const host = this.getHost(roomId);

    const hostSubs = this.hostSubs.get(roomId);
    if (hostSubs) {
      hostSubs.forEach((cb) => cb(host!));
      this.hostSubs.delete(roomId);
    }
  };

  private notifyGuestSubs = (roomId: string) => {
    const guest = this.getGuest(roomId);

    const guestSubs = this.guestSubs.get(roomId);
    if (guestSubs) {
      guestSubs.forEach((cb) => cb(guest!));
      this.guestSubs.delete(roomId);
    }
  };

  public hostRoom = (name: string, roomId?: string) => {
    const host = new LZRHost(name, roomId);
    host.notifySubscribers = this.notifyHostSubs;
    host.setCloseHostFunc(() => this.closeHost(host.roomId));

    this.hosts.push(host);

    //if there are any subscribers waiting for a host to be created, call their callbacks

    const hostSubs = this.hostSubs.get(host.id);

    if (hostSubs) {
      hostSubs.forEach((cb) => cb(host));
      this.hostSubs.delete(host.id);
    }

    return host;
  };

  public joinRoom = (name: string, roomId: string) => {
    const guest = new LZRGuest(name, roomId);
    guest.notifySubscribers = this.notifyGuestSubs;
    this.guests.push(guest);

    //if there are any subscribers waiting for a guest to be created, call their callbacks
    const guestSubs = this.guestSubs.get(guest.id);

    if (guestSubs) {
      guestSubs.forEach((cb) => cb(guest));
      this.guestSubs.delete(guest.id);
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
      const hostSubs = this.hostSubs.get(roomId);

      if (hostSubs) {
        hostSubs.push(cb);
      } else {
        this.hostSubs.set(roomId, [cb]);
      }
    }
  };

  public waitForGuest = (roomId: string, cb: LZRGuestCb) => {
    const guest = this.getGuest(roomId);
    if (guest && guest.isConnected) {
      cb(guest);
    } else {
      const guestSubs = this.guestSubs.get(roomId);

      if (guestSubs) {
        guestSubs.push(cb);
      } else {
        this.guestSubs.set(roomId, [cb]);
      }
    }
  };
}

export default LZRRoom;
