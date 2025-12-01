export const ROLES = {
	USER: 'user',
	ADMIN: 'admin',
};

export function isAdmin(user) {
	return user?.roles?.includes(ROLES.ADMIN);
}
