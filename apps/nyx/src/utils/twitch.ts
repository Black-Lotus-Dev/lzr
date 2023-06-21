import * as rp from 'request-promise';

type TwitchAccountType = 'main' | 'bot';
// type TwitchApiResult = {
// 	password: string;
// 	user: User;
// };

interface TwitchAccount {
	id: string;
	email: string;
	id_token: string;
	access_token: string;
	refresh_token: string;
	login: string;
	display_name: string;
	broadcaster_type: string;
	description: string;
	profile_image_url: string;
	offline_image_url: string;
}

const getTwitchUserInfo = async (access_token: string) => {
	console.log('getTwitchUserInfo');
	return await rp
		.get('https://api.twitch.tv/helix/users', {
			headers: {
				'Client-Id': 'g6uqmwoijywz7787e9yh3th97o0k3l',
				Authorization: `Bearer ${access_token}`,
			},
		})
		.then((result) => {
			console.log('twitch user info', JSON.parse(result));
			const users: TwitchAccount[] = JSON.parse(result).data;
			if (users.length === 0) throw new Error('no user found');
			return users[0];
		});
};

const getTwitchUserToken = async (code: string) => {
	console.log('getTwitchUserToken');
	try {
		const tokenData = await rp.post('https://id.twitch.tv/oauth2/token', {
			headers: { 'Content-Type': 'multipart/form-data' },
			form: {
				client_id: 'g6uqmwoijywz7787e9yh3th97o0k3l',
				client_secret: 'tsfl10zja4xycgwgr54t7e7kbn3p5d',
				code,
				grant_type: 'authorization_code',
				redirect_uri: 'https://ssrlogoszrbot-5n4mun72lq-uc.a.run.app',
			},
		});

		return JSON.parse(tokenData);
	} catch (err) {
		console.log('fetch error', err);
	}
};

export { getTwitchUserInfo, getTwitchUserToken, TwitchAccountType };
