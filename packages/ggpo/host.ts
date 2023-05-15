//this is the host peer that will be used to host the room

import { createRandString, _ } from "@black-lotus-dev/shared/utils"
import { ActionSender, joinRoom, Room, selfId } from "trystero";
import { LZRChannel } from "./channel";
const config = { appId: "https://logoszr-bot-default-rtdb.firebaseio.com" };

//the host the admin of the room and handles the 1 to many connections between guests
//guests should only connect to the host and not each other directly
//to prevent unsecure and unneeded guest to guest connections
//the host will handle the connections between guests and will only allow verified guests to connect to each other

interface Peer {
  name: string;
  id: string;
  channels: string[];
}

class Host {
  //details about the host
  public name: string;
  public id: string;

  //details about the room
  private room: Room; //the webrtc connection to the room
  public roomId: string;
  public roomName: string;

  public guests: { [key: string]: Peer } = {}; //the guests that are currently connected to the room
  public channels: {
    [key: string]: LZRChannel<any>;
  } = {};

  public closeLzrRoom: () => void = () => {};
  public notifySubscribers: (roomId: string) => void = () => {};
  public kickPeer: ActionSender<0>;

  public kick = (guestId: string) => this.kickPeer(0, guestId);

  constructor(name: string, roomId?: string) {
    this.name = name;
    this.roomName = name;
    this.roomId = roomId || createRandString();
    this.id = selfId;
    
    this.room = joinRoom(config, this.roomId);
    this.startRoom();
    
    this.kickPeer = this.room.makeAction<0>("kick-peer")[0];
  }

  //this function will start the room and kick off the host peer
  private startRoom() {
    this.notifySubscribers(this.roomId);

    //start the host peer
    this.startNetCode();

    //start the channel sub listener
    this.channelSubListener();
  }

  public setCloseHostFunc = (cb: () => void) => {
    this.closeLzrRoom = cb;
  };

  public closeRoom() {
    this.room.leave();
    this.closeLzrRoom();
  }

  private channelSubListener() {
    const channelSubAction = this.createChannel<string>("channel");
    channelSubAction.get((channel, guestId) => {
      //if we dont know the guest, ignore them
      if (!this.guests[guestId]) return;

      //add channel to guests subscriptions
      this.guests[guestId].channels = this.guests[guestId].channels || [];
      this.guests[guestId].channels!.push(channel);
    });
  }

  private startNetCode() {
    const auth = this.createChannel<Peer>("room-auth");

    //this handles the auth details received from guests
    auth.get((guest: Peer, guestId: string) => {
      //if guests ids dont match, ignore them
      if (guest.id !== guestId) return;

      //if we already know the guest we can ignore them
      if (this.guests[guestId]) return;

      //if we dont know the guest, add them to the pending list
      this.guests[guestId] = guest;
    });

    //handles new guest connections
    this.room.onPeerJoin((guestId) => {
      if (this.guests[guestId]) return; //if we already know the guest we can ignore them
      auth._send({ name: this.roomName, channels: [], id: this.id });
    });

    this.room.onPeerLeave((guestId) => {
      delete this.guests[guestId];
    });

    //initial call to open auth to guests that are already connected to the tryestro room
    auth._send({ name: this.roomName, channels: [], id: this.id });
  }

  private handleSendWrapper = <T>(channel: string, data: T) => {
    //double check that the channel exists
    if (!this.channels[channel]) return;

    //loop through all our guests and find the ones that are subscribed to this action
    const subbedGuests =
      Object.keys(this.guests)
        .map((g) => this.guests[g])
        .filter((g) => g.channels?.includes(channel))
        .map((g) => g.id)
        .filter((g) => g !== undefined) || [];

    if (subbedGuests.length === 0) return;

    this.channels[channel]._send(data, subbedGuests);
  };

  public createChannel<T>(channel: string): LZRChannel<T> {
    if (!this.channels[channel]) {
      const [send, get, progress] = this.room.makeAction<T>(channel);

      const lzrSendAction = (data: T) => this.handleSendWrapper(channel, data);
      this.channels[channel] = {
        send: lzrSendAction,
        _send: send,
        get,
        progress,
      };
    }

    return this.channels[channel];
  }
}

export default Host;
