import toast from "react-hot-toast";
import LzrStore from "./lzrStore";

//create mapped type of stores

type LzrStoreCache = { [key: string]: LzrStore<any> };

class LzrStoreManager {
  private stores: LzrStoreCache = {};
  private saveTimer: NodeJS.Timer;
  public autoSaveEnabled: boolean = false;

  constructor() {
    this.autoSaveEnabled && this.startAutoSaveTimer();
  }

  public registerStore<T>(store: LzrStore<T>): void {
    this.stores[store.filename] = store;
  }

  private startAutoSaveTimer(): void {
    clearInterval(this.saveTimer);
    this.saveTimer = setInterval(() => {
      this.saveAll();
    }, 60 * 1000 * 10); // Save every ten minutes
  }

  public saveAll() {
    //save all stores in parallel
    const promises = Object.keys(this.stores).map((filename) => {
      return this.stores[filename].save();
    });

    Promise.all(promises);
  }

  public removeStore(filename: string): void {
    this.stores[filename].destroy();
  }

  public doesStoreExist(filename: string): boolean {
    const fileNames = Object.keys(this.stores);
    return fileNames.includes(filename);
  }

  public getStore<T>(filename: string): LzrStore<T> {
    return this.stores[filename];
  }
}

const lzrStoreManager = new LzrStoreManager();

export { type LzrStoreManager, lzrStoreManager };
