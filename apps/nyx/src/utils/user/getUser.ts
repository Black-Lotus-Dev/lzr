import { User } from '../../types/user';
import { userConverter } from '../../converters/userConverter';
import { FbUserDataProps } from '../../types/firebase/user';
import { db } from '../admin';

//get user from db
export async function getUserById(userId: string) {
	return await db
		.doc(`user/${userId}`)
		.withConverter(userConverter)
		.get()
		.then((userDoc): FbUserDataProps => {
			if (!userDoc.exists) throw 'USER_REC_NF';
			return { user: userDoc.data() as User, ref: userDoc.ref };
		})
		.catch((err) => {
			throw err;
		});
}

export async function getUserByProp(prop: string, value: string) {
	return await db
		.collection('users')
		.where(prop, '==', value)
		.withConverter(userConverter)
		.get()
		.then((userDocs): FbUserDataProps => {
			if (!userDocs.empty) throw 'USER_REC_NF';
			const userDoc = userDocs.docs[0];
			return {
				user: userDoc.data(),
				ref: userDoc.ref,
			};
		})
		.catch((err) => {
			throw err;
		});
}
