import { reduxStore } from "../redux/store";
/* eslint-disable import/no-cycle */
import axios from "axios";
import createReqBody from "./createReqBody";

export type ApiReq = {
  path: string;
  data?: any;
  includeUserId?: boolean;
};

export async function fetchApi<T>({
  path,
  data = {},
  includeUserId = true,
}: ApiReq): Promise<T> {
  reduxStore.dispatch.lzr.setIsLoading(true);
  const apiPath = `${import.meta.env.VITE_API_URL}/${path}`;
  // const apiPath = `http://127.0.0.1:5001/logoszr-bot/us-central1/api/${path}`;
  const body = await createReqBody(data, includeUserId);
  const res = await axios.post(apiPath, body);
  reduxStore.dispatch.lzr.setIsLoading(false);
  return res.data as T;
}
