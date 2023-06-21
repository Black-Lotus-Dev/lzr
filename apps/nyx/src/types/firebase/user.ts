import { DocumentData, DocumentReference } from 'firebase-admin/firestore';
import { User } from '../../types/user';

export type FbUserDataProps = {
	user: User;
	ref: DocumentReference<DocumentData>;
};
