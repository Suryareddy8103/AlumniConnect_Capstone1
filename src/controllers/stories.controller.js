// src/controllers/stories.controller.js
import { Story } from '../models/Story.js';
import { isAdmin } from '../utils/roles.js';

function canEdit(user, story) {
	return isAdmin(user) || story.author.toString() === user._id.toString();
}

export async function listStories(req, res, next) {
	try {
		const page = Math.max(parseInt(req.query.page) || 1, 1);
		const limit = Math.min(parseInt(req.query.limit) || 20, 100);

		const filters = {};

		if (req.query.q) {
			filters.$text = { $search: req.query.q };
		}
		if (req.query.author) {
			filters.author = req.query.author;
		}
		if (req.query.company) {
			filters.company = new RegExp(req.query.company, 'i');
		}
		if (req.query.year) {
			filters.year = Number(req.query.year);
		}
		if (req.query.tags) {
			filters.tags = { $in: req.query.tags.split(',') };
		}

		const [items, total] = await Promise.all([
			Story.find(filters)
				.skip((page - 1) * limit)
				.limit(limit)
				.sort({ createdAt: -1 }),
			Story.countDocuments(filters),
		]);

		return res.json({ items, page, limit, total });
	} catch (err) {
		next(err);
	}
}

export async function getStory(req, res, next) {
	try {
		const story = await Story.findById(req.params.id);
		if (!story) {
			return res.status(404).json({ message: 'Story not found' });
		}
		return res.json({ story });
	} catch (err) {
		next(err);
	}
}

export async function createStory(req, res, next) {
	try {
		const story = await Story.create({ ...req.body, author: req.user._id });
		return res.status(201).json({ story });
	} catch (err) {
		next(err);
	}
}

export async function updateStory(req, res, next) {
	try {
		const story = await Story.findById(req.params.id);
		if (!story) {
			return res.status(404).json({ message: 'Story not found' });
		}
		if (!canEdit(req.user, story)) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		Object.assign(story, req.body);
		await story.save();

		return res.json({ story });
	} catch (err) {
		next(err);
	}
}

export async function deleteStory(req, res, next) {
	try {
		const story = await Story.findById(req.params.id);
		if (!story) {
			return res.status(404).json({ message: 'Story not found' });
		}
		if (!canEdit(req.user, story)) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		await story.deleteOne();
		return res.json({ message: 'Deleted' });
	} catch (err) {
		next(err);
	}
}
