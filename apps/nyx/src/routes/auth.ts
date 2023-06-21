import { Router } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { db } from '../utils/admin';
import { getSpotifyUserToken } from '../utils/spotify';
import { getTwitchUserInfo, getTwitchUserToken } from '../utils/twitch';

const authRouter = Router();

interface TwitchTokenData {
	access_token: string;
	refresh_token: string;
}

authRouter.post('/auth/login', async (req) => {
	console.log('auth login');

	const { code, state } = req.body;
	const doc = await db.collection('auth').doc(state).get();
	if (!doc.exists) throw new Error('No such document!');

	const docData = doc.data();
	if (docData === undefined) throw new Error('No such document!');

	if (['lzr', 'twitch'].includes(docData.client)) {
		const { access_token, refresh_token } = (await getTwitchUserToken(
			code
		)) as TwitchTokenData;

		let id: string | null = null;
		if (docData.client === 'lzr') {
			//we are doing the 1st login to twitch main account
			const twitchUser = await getTwitchUserInfo(access_token);
			id = twitchUser.id;

			//check if user already has an account
			await getAuth()
				.getUserByEmail(twitchUser.email)
				.catch(() => {
					//no user account created so make one
					getAuth().createUser({
						uid: twitchUser.id,
						email: twitchUser.email,
						password: twitchUser.id,
						displayName: twitchUser.display_name,
						photoURL: twitchUser.profile_image_url,
					});

					//create a new user in the db
					db.collection('users').doc(twitchUser.id).set({
						twitchLevel: twitchUser.broadcaster_type,
						userId: twitchUser.id,
						displayName: twitchUser.display_name,
						img: twitchUser.profile_image_url,
						email: twitchUser.email,
						created: new Date(),
					});
				});
		}

		doc.ref.update({
			access_token,
			refresh_token,
			id,
		});
	} else if (docData.client === 'spotify') {
		getSpotifyUserToken(code, doc);
	}
});

export { authRouter };
