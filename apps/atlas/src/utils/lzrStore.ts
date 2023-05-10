import LzrStore from "@/lzrStore/lzrStore";
import { lzrStoreManager } from "@/lzrStore/lzrStoreManager";
import { Store } from "tauri-plugin-store-api";

export async function createLzrStore<T>(
  fileName: string,
  initData?: T
): Promise<LzrStore<T>> {
  if (lzrStoreManager.doesStoreExist(fileName))
    return lzrStoreManager.getStore<T>(fileName);

  const store = new Store(fileName);

  let initState = {} as T;
  const keys = await store.keys();
  for (const key of keys) {
    const value = await store.get(key);
    initState[key] = value;
  }

  if (initData) initState = { ...initState, ...initData };

  return new LzrStore(fileName, store, initState);
}
