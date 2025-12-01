import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ROLES } from '../utils/roles.js';

export async function authRequired(req, res, next) {
	try {
		const header = req.headers.authorization || '';
		const token = header.startsWith('Bearer ') ? header.substring(7) : null;
		if (!token) return res.status(401).json({ message: 'Missing token' });
		const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
		const user = await User.findById(payload.sub);
		if (!user) return res.status(401).json({ message: 'Invalid token' });
		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
}

export function requireRoles(...roles) {
	return (req, res, next) => {
		const userRoles = req.user?.roles || [];
		const allowed = roles.some((r) => userRoles.includes(r));
		if (!allowed) return res.status(403).json({ message: 'Forbidden' });
		next();
	};
}

export const requireAdmin = requireRoles(ROLES.ADMIN);
