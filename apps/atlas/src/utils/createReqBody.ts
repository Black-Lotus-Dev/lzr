import { mainTwitchClient } from "../lzrClients/twitch/client";
import { reduxStore } from "../redux/store";
export default async function createReqBody(
  otherData = {},
  includeUserId: boolean
) {
  const { user, twitch } = reduxStore.getState();
  const userId = user.auth?.uid ?? mainTwitchClient.account.id;

  return includeUserId
    ? {
        userId,
        ...otherData,
      }
    : otherData;
}
