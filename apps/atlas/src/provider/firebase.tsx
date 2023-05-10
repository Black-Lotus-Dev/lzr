// Import the functions you need from the SDKs you need
import React from "react";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  AuthProvider,
  FirestoreProvider,
  StorageProvider,
  useFirebaseApp,
} from "reactfire";

import { getStorage } from "firebase/storage";

const FirebaseWrapper = ({ children }: { children: React.ReactNode }) => {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={db}>
        <StorageProvider sdk={storage}>{children}</StorageProvider>
      </FirestoreProvider>
    </AuthProvider>
  );
};

export default FirebaseWrapper;
