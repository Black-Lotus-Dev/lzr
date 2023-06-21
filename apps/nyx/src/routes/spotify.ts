import { Router } from 'express';
import authConsts from '../constants/auth';
import * as rp from 'request-promise';

const spotifyRouter = Router();
//Returning user info from db

spotifyRouter.post('/spotify/getUserQueue', async (req, res) => {
	const { accessToken }: { accessToken: string } = req.body;

	const authOptions = {
		url: 'https://api.music.com/v1/me/player/queue',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	const tokenData = await rp.get(authOptions);
	res.send(tokenData);
});

spotifyRouter.post('/spotify/refreshToken', async (req, res) => {
	const { refreshToken }: { refreshToken: string } = req.body;

	const authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		},
		headers: {
			Authorization:
				'Basic ' +
				new Buffer(
					authConsts.spotify.clientId + ':' + authConsts.spotify.clientSecret
				).toString('base64'),
		},
		json: true,
	};

	const tokenData = await rp.post(authOptions);
	console.log('tokenData', tokenData);
	res.send(tokenData);
});

export { spotifyRouter };
