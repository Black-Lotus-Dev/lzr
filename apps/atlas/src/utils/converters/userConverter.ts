import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { LZRUser } from "@lzrTypes/user";

export default {
  toFirestore(_: LZRUser): DocumentData {
    return _;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): LZRUser {
    const { email, displayName, img, externalAccounts } = snapshot.data();

    return {
      userId: snapshot.id,
      email,
      displayName,
      img,
      externalAccounts,
    };
  },
} as FirestoreDataConverter<LZRUser>;
