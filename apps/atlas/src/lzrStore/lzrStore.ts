import { Store } from "tauri-plugin-store-api";
import { BehaviorSubject } from "rxjs";
import { lzrStoreManager } from "./lzrStoreManager";
import toast from "react-hot-toast";

class LzrStore<T> {
  private readonly $state = new BehaviorSubject<T>(null);
  private saveTimer?: NodeJS.Timeout;
  public state: T;
  private store?: Store;

  constructor(
    public readonly filename: string,
    store: Store,
    private readonly initData?: T
  ) {
    this.store = store;
    this.$state.subscribe((state) => (this.state = state));
    lzrStoreManager.registerStore(this);
    this.state = initData;
  }

  public update(data: Partial<T>): void {
    this.$state.next({ ...this.state, ...data });
  }

  public save() {
    console.log("Saving", this.filename);
    console.log(this.state);
    Array.from(Object.keys(this.state)).map((key) => {
      this.store.set(key, this.state[key]);
    });

    toast.success(this.filename + " - Saved");
    this.store.save();
  }

  public destroy(): void {
    lzrStoreManager.removeStore(this.filename);
  }

  public subscribe(callback: (oldState: T | null, newState: T) => void): void {
    let oldState: T | null = null;
    this.$state.subscribe((state) => {
      if (state) {
        if (oldState === null) {
          oldState = state;
        } else if (JSON.stringify(oldState) !== JSON.stringify(state)) {
          callback(oldState, state);
          oldState = state;
        }
      }
    });
  }
}

export default LzrStore;
