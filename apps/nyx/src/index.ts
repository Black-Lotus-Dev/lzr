import functions from 'firebase-functions';
import express from 'express';
import bodyParser from 'body-parser';
import { functionsConfig } from './configs/functions-config';
import { userRouter } from './routes/user';
import { spotifyRouter } from './routes/spotify';
import { config } from 'dotenv';
import { authRouter } from './routes/auth';

config();

const app = express();

const corsOptions = {
	whitelist: functionsConfig.whitelist,
	default: 'https://ssrlogoszrbot-5n4mun72lq-uc.a.run.app',
};

app.all('*', function (req, res, next) {
	const env = process.env.ENV;
	if (env === 'dev') {
		res.header('Access-Control-Allow-Origin', '*');
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept'
		);
		next();
		return;
	}

	const reqOrigin = req.header('origin');
	if (reqOrigin === undefined) return;

	const host = reqOrigin.split('/')[2];
	const isHostInWhitelist = corsOptions.whitelist.includes(host);
	if (!isHostInWhitelist) {
		console.log('host not in whitelist');
		return;
	}

	const origin = req.headers.origin || corsOptions.default;

	res.header('Access-Control-Allow-Origin', origin);
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authRouter);
app.use(spotifyRouter);
app.use(userRouter);

exports.api = functions.https.onRequest(app);
export { app };
