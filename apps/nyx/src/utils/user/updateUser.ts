import { getUserById } from './getUser';
import { createMasterPassword } from './password';
import { auth } from '../admin';
import { ExternalAccount, User } from '../../types/user';

export async function linkUserExternalAccount(
	userId: string,
	externalAccounts: ExternalAccount
) {
	return await getUserById(userId)
		.then(async (result) => {
			const { ref } = result;
			await ref
				.update({
					externalAccounts: externalAccounts,
				})
				.catch((err: any) => {
					throw 'Error updating the user record with linked account data';
				});
		})
		.catch((err) => {
			throw `USER_ACC_LINK | ${err}`;
		});
}

export const updateUserPassword = async (user: User) => {
	return await createMasterPassword(user)
		.then(async (password) => {
			await auth.updateUser(user.userId, {
				password,
				disabled: false,
			});

			return password;
		})
		.catch((err) => {
			throw `USER_ACC_LINK | ${err}`;
		});
};
