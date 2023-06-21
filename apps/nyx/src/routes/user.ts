import { getUserById } from '../utils/user/getUser';
import { Router } from 'express';
import { User } from '../types/user';
import { db, auth } from '../utils/admin';
import { createMasterPassword } from '../utils/user/password';
import { updateUserPassword } from '../utils/user/updateUser';
import { getAuth } from 'firebase-admin/auth';

const userRouter = Router();
//Returning user info from db

userRouter.post('/user/getUserInfo', async (req, res) => {
	const userId = req.body.userId;
	const result = await getUserById(userId);

	res.send(result);
});

userRouter.post('/user/createUser', async (req, res) => {
	const user: User = req.body;
	const returnValue = await createUser(user).then((result) => {
		return result;
	});

	res.send(returnValue);
});

userRouter.post('/user/getToken', async (req, res) => {
	console.log('getting token', req.body);
	const token = await getAuth().createCustomToken(req.body.userId);
	res.send(token);
});

export async function createUser(newUser: User) {
	//check if user already exists (maybe they logged in on a different tab or device)
	const authUser = await auth
		.getUserByEmail(newUser.email)
		.catch(() => undefined);

	let encryptedPass: string;
	if (authUser === undefined) {
		encryptedPass = await createNewUserAccount(newUser);
		//no user account created at all so make a new one
	} else {
		//account already exists so overwrite it
		newUser = (await getUserById(authUser.uid)).user;
		encryptedPass = await updateUserPassword(newUser);
	}

	return {
		password: encryptedPass,
		user: newUser,
	};
}
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

export { userRouter };
