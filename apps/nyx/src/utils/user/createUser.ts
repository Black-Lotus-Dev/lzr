import { User } from '../../types/user';
import { db, auth } from '../admin';
import { createMasterPassword } from './password';
// user account creation
export const createNewUserAccount = async (user: User) => {
	// create master password for user
	const password = await createMasterPassword(user);

	// create the users auth account so they can login
	await auth.createUser({
		uid: user.userId,
		password,
		displayName: user.displayName,
		photoURL: user.img,
		email: user.email,
	});

	// create new db record for this user
	await createNewUserRecord(user);

	return password;
};

export const createNewUserRecord = async (user: User) => {
	const { userId, ...otherUserFields } = user;
	await db.doc(`/user/${userId}`).set(otherUserFields);
};
