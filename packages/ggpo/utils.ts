import LZRRoom from "./room";

const lzrRoom = new LZRRoom();

//export the functions that will be used by the rest of the app
const hostLZRRoom = lzrRoom.hostRoom;
const joinLZRRoom = lzrRoom.joinRoom;

const waitForLzrHost = lzrRoom.waitForHost;
const waitForLzrGuest = lzrRoom.waitForGuest;

const getLzrHost = lzrRoom.getHost;
const getLzrGuest = lzrRoom.getGuest;

export {
  hostLZRRoom,
  joinLZRRoom,
  waitForLzrHost,
  waitForLzrGuest,
  getLzrHost,
  getLzrGuest,
};
