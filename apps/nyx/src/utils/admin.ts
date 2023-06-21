import * as admin from 'firebase-admin';
import { fbAdminConfig } from '../configs/fbAdminConfig';
import { ServiceAccount } from 'firebase-admin/app';

admin.initializeApp({
	credential: admin.credential.cert(fbAdminConfig as ServiceAccount),
	storageBucket: 'logoszr-bot.appspot.com',
	databaseURL: 'https://logoszr-bot.firebaseio.com',
});

const auth = admin.auth();
const db = admin.firestore();
db.settings({
	ignoreUndefinedProperties: true,
});
const bucket = admin.storage().bucket();
export { auth, bucket, db };
