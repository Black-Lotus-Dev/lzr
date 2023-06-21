import { User } from '../../types/user';
import * as crypto from 'crypto';

export function createBasePassword(user: User): string {
	return user.userId + '|' + user.displayName;
}

export async function createMasterPassword(user: User): Promise<string> {
	// generate random 16 bytes long salt
	const password = createBasePassword(user);
	const salt = crypto.randomBytes(16).toString('hex');
	const encryptedPassword: string = await new Promise((resolve, reject) => {
		crypto.scrypt(password, salt, 64, (err: any, derivedKey) => {
			if (err) reject(err);
			resolve(salt + ':' + derivedKey.toString('hex'));
		});
	});

	return encryptedPassword;
}

export async function verifyMasterPassword(
	user: User,
	hash: string
): Promise<boolean> {
	const password = createBasePassword(user);
	return new Promise((resolve, reject) => {
		const [salt, key] = hash.split(':');
		crypto.scrypt(password, salt, 64, (err: any, derivedKey) => {
			if (err) reject(err);
			resolve(key == derivedKey.toString('hex'));
		});
	});
}
