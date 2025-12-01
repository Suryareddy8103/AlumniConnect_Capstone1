// src/controllers/jobs.controller.js
import { Job } from '../models/Job.js';
import { isAdmin } from '../utils/roles.js';

function canEditJob(user, job) {
	if (!user || !job) return false;
	return isAdmin(user) || job.postedBy?.toString() === user._id.toString();
}

export async function listJobs(req, res, next) {
	try {
		const page = Math.max(parseInt(req.query.page) || 1, 1);
		const limit = Math.min(parseInt(req.query.limit) || 20, 100);

		const filters = {};

		if (req.query.q) {
			// Requires text index on Job (title/description/etc.)
			filters.$text = { $search: req.query.q };
		}
		if (req.query.company) {
			filters.company = new RegExp(req.query.company, 'i');
		}
		if (req.query.location) {
			filters.location = new RegExp(req.query.location, 'i');
		}
		if (req.query.postedBy) {
			filters.postedBy = req.query.postedBy;
		}

		const [items, total] = await Promise.all([
			Job.find(filters)
				.skip((page - 1) * limit)
				.limit(limit)
				.sort({ postedAt: -1 }),
			Job.countDocuments(filters),
		]);

		return res.json({ items, page, limit, total });
	} catch (err) {
		next(err);
	}
}

export async function createJob(req, res, next) {
	try {
		const data = {
			...req.body,
			postedBy: req.user._id,
		};

		// If model doesn't auto-set postedAt, we can ensure here
		if (!data.postedAt) {
			data.postedAt = new Date();
		}

		const job = await Job.create(data);
		return res.status(201).json({ job });
	} catch (err) {
		next(err);
	}
}

export async function getJob(req, res, next) {
	try {
		const job = await Job.findById(req.params.id);
		if (!job) {
			return res.status(404).json({ message: 'Job not found' });
		}
		return res.json({ job });
	} catch (err) {
		next(err);
	}
}

export async function updateJob(req, res, next) {
	try {
		const job = await Job.findById(req.params.id);
		if (!job) {
			return res.status(404).json({ message: 'Job not found' });
		}

		// Only poster or admin can edit
		if (!canEditJob(req.user, job)) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		Object.assign(job, req.body);
		await job.save();

		return res.json({ job });
	} catch (err) {
		next(err);
	}
}

export async function deleteJob(req, res, next) {
	try {
		const job = await Job.findById(req.params.id);
		if (!job) {
			return res.status(404).json({ message: 'Job not found' });
		}

		// Only poster or admin can delete
		if (!canEditJob(req.user, job)) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		await job.deleteOne();
		return res.json({ message: 'Deleted' });
	} catch (err) {
		next(err);
	}
}
