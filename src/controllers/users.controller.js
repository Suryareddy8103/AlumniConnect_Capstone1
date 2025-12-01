// src/controllers/users.controller.js
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { isAdmin } from '../utils/roles.js';
import bcrypt from 'bcrypt';

function buildUserFilters(query) {
	const filters = {};

	if (query.q) {
		const regex = new RegExp(query.q, 'i');
		filters.$or = [
			{ firstName: regex },
			{ lastName: regex },
			{ company: regex },
			{ industry: regex },
			{ major: regex },
		];
	}

	if (query.graduationYear) {
		filters.graduationYear = Number(query.graduationYear);
	}

	if (query.degree) {
		filters.degree = new RegExp(query.degree, 'i');
	}

	if (query.location) {
		filters.location = new RegExp(query.location, 'i');
	}

	if (query.industry) {
		filters.industry = new RegExp(query.industry, 'i');
	}

	if (query.company) {
		filters.company = new RegExp(query.company, 'i');
	}

	return filters;
}

export async function listUsers(req, res, next) {
	try {
		const page = Math.max(parseInt(req.query.page) || 1, 1);
		const limit = Math.min(parseInt(req.query.limit) || 20, 100);
		const filters = buildUserFilters(req.query);

		const [items, total] = await Promise.all([
			User.find(filters)
				.select('-password')
				.skip((page - 1) * limit)
				.limit(limit)
				.sort({ createdAt: -1 }),
			User.countDocuments(filters),
		]);

		return res.json({ items, page, limit, total });
	} catch (err) {
		next(err);
	}
}

export async function getUser(req, res, next) {
	try {
		const user = await User.findById(req.params.id).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		return res.json({ user });
	} catch (err) {
		next(err);
	}
}

export async function updateMe(req, res, next) {
	try {
		// Only allow profile-type fields to be updated by the user
		const allowed = ({
			firstName,
			lastName,
			graduationYear,
			degree,
			major,
			location,
			industry,
			company,
			headline,
			bio,
		}) => ({
			firstName,
			lastName,
			graduationYear,
			degree,
			major,
			location,
			industry,
			company,
			headline,
			bio,
		});

		const updates = allowed(req.body);
		Object.keys(updates).forEach(
			(k) => updates[k] === undefined && delete updates[k]
		);

		if (req.file) {
			updates.avatarUrl = `/uploads/${req.file.filename}`;
		}

		const user = await User.findByIdAndUpdate(req.user._id, updates, {
			new: true,
		}).select('-password');

		return res.json({ user });
	} catch (err) {
		next(err);
	}
}

export async function changePassword(req, res, next) {
	try {
		const { currentPassword, newPassword } = req.body;
		const user = await User.findById(req.user._id).select('+password');

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const ok = await user.comparePassword(currentPassword);
		if (!ok) {
			return res.status(400).json({ message: 'Current password is incorrect' });
		}

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(newPassword, salt);
		await user.save();

		return res.json({ message: 'Password updated' });
	} catch (err) {
		next(err);
	}
}

export async function connectUser(req, res, next) {
	try {
		const targetId = req.params.id;

		if (req.user._id.toString() === targetId) {
			return res.status(400).json({ message: 'Cannot connect to yourself' });
		}

		await User.findByIdAndUpdate(req.user._id, {
			$addToSet: { connections: targetId },
		});

		return res.json({ message: 'Connected' });
	} catch (err) {
		next(err);
	}
}

export async function disconnectUser(req, res, next) {
	try {
		const targetId = req.params.id;

		await User.findByIdAndUpdate(req.user._id, {
			$pull: { connections: targetId },
		});

		return res.json({ message: 'Disconnected' });
	} catch (err) {
		next(err);
	}
}

export async function deleteUser(req, res, next) {
	try {
		const targetId = req.params.id;

		if (!isAdmin(req.user) && req.user._id.toString() !== targetId) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		await User.findByIdAndDelete(targetId);
		return res.json({ message: 'Deleted' });
	} catch (err) {
		next(err);
	}
}

export async function updateUser(req, res, next) {
	try {
		const targetId = req.params.id;
		// Only admins allowed (route should be protected by requireAdmin)

		const allowed = ({
			firstName,
			lastName,
			graduationYear,
			degree,
			major,
			location,
			industry,
			company,
			headline,
			bio,
		}) => ({
			firstName,
			lastName,
			graduationYear,
			degree,
			major,
			location,
			industry,
			company,
			headline,
			bio,
		});

		const updates = allowed(req.body);
		Object.keys(updates).forEach(
			(k) => updates[k] === undefined && delete updates[k]
		);

		if (req.file) {
			updates.avatarUrl = `/uploads/${req.file.filename}`;
		}

		const user = await User.findByIdAndUpdate(targetId, updates, {
			new: true,
		}).select('-password');

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.json({ user });
	} catch (err) {
		next(err);
	}
}
