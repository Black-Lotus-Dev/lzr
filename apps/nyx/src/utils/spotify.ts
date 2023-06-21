import * as rp from 'request-promise';
import authConsts from '../constants/auth';

const getSpotifyUserToken = async (
	code: string,
	doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
) => {
	console.log('getSpotifyUserToken');
	console.log('authConsts', authConsts);
	try {
		const authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code,
				redirect_uri: 'https://ssrlogoszrbot-5n4mun72lq-uc.a.run.app',
				grant_type: 'authorization_code',
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

		doc.ref.update({
			access_token: tokenData.access_token,
			refresh_token: tokenData.refresh_token,
		});
	} catch (err) {
		console.log('fetch error', err);
	}
};

export { getSpotifyUserToken };
