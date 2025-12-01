// src/controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

function signToken(user) {
	const payload = { sub: user._id.toString(), roles: user.roles };
	const secret = process.env.JWT_SECRET || 'devsecret';
	const expiresIn = process.env.JWT_EXPIRES_IN || '30d'; // 30 days
	return jwt.sign(payload, secret, { expiresIn });
}

// helper to keep user shape consistent everywhere
function toUserResponse(u) {
	if (!u) return null;
	return {
		id: u._id,
		_id: u._id,
		firstName: u.firstName,
		lastName: u.lastName,
		email: u.email,
		roles: u.roles,
		avatarUrl: u.avatarUrl,
		graduationYear: u.graduationYear,
		degree: u.degree,
		major: u.major,
		location: u.location,
		company: u.company,
		headline: u.headline,
		bio: u.bio,
		connections: u.connections,
		createdAt: u.createdAt,
		updatedAt: u.updatedAt,
	};
}

export async function register(req, res, next) {
	try {
		const { firstName, lastName, email, password, graduationYear, degree, major } = req.body;

		const exists = await User.findOne({ email });
		if (exists) {
			return res.status(409).json({ message: 'Email already registered' });
		}

		const user = await User.create({
			firstName,
			lastName,
			email,
			password,
			graduationYear,
			degree,
			major,
		});

		const token = signToken(user);
		return res.status(201).json({
			token,
			user: toUserResponse(user),
		});
	} catch (err) {
		next(err);
	}
}

export async function login(req, res, next) {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).select('+password');
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const ok = await user.comparePassword(password);
		if (!ok) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const token = signToken(user);
		// NOTE: user is already loaded; no need to re-query
		return res.json({
			token,
			user: toUserResponse(user),
		});
	} catch (err) {
		next(err);
	}
}

export async function me(req, res) {
	const u = req.user;
	return res.json({
		user: toUserResponse(u),
	});
}

export async function requestPasswordReset(req, res) {
	// Placeholder: in production, send email with token link
	return res.json({
		message: 'If the email exists, a reset link will be sent.',
	});
}
