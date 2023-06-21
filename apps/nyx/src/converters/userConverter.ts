import {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { User } from '../types/user';

export const userConverter: FirestoreDataConverter<User> = {
	toFirestore(post: User): DocumentData {
		return {};
	},
	fromFirestore(snapshot: QueryDocumentSnapshot): User {
		const { email, displayName, img, externalAccounts } = snapshot.data();

		return {
			userId: snapshot.id,
			email,
			displayName,
			img,
			externalAccounts,
		};
	},
};
