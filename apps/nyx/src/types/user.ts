import { allExternalAccounts } from '../constants/user';

// types
type ExternalAccount = typeof allExternalAccounts[number];

interface User {
	userId: string;
	displayName: string;
	email: string;
	img: string;
	externalAccounts: ExternalAccount[];
}

export type { User, ExternalAccount };
