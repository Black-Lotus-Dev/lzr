const channels = ["song"] as const;
type MusicChannel = typeof channels[number];

export { type MusicChannel, channels as musicChannels };
