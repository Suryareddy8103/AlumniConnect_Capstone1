// src/controllers/events.controller.js
import { Event } from '../models/Event.js';

export async function listEvents(req, res, next) {
	try {
		const page = Math.max(parseInt(req.query.page) || 1, 1);
		const limit = Math.min(parseInt(req.query.limit) || 20, 100);
		const filters = {};

		if (req.query.upcoming === 'true') {
			filters.datetime = { $gte: new Date() };
		}
		if (req.query.past === 'true') {
			filters.datetime = { $lt: new Date() };
		}

		const [items, total] = await Promise.all([
			Event.find(filters)
				.skip((page - 1) * limit)
				.limit(limit)
				.sort({ datetime: 1 }),
			Event.countDocuments(filters),
		]);

		return res.json({ items, page, limit, total });
	} catch (err) {
		next(err);
	}
}

export async function createEvent(req, res, next) {
	try {
		const data = { ...req.body, createdBy: req.user._id };
		if (req.file) {
			data.imageUrl = `/uploads/${req.file.filename}`;
		}
		const event = await Event.create(data);
		return res.status(201).json({ event });
	} catch (err) {
		next(err);
	}
}

export async function getEvent(req, res, next) {
	try {
		const event = await Event.findById(req.params.id);
		if (!event) {
			return res.status(404).json({ message: 'Event not found' });
		}
		return res.json({ event });
	} catch (err) {
		next(err);
	}
}

export async function updateEvent(req, res, next) {
	try {
		const updates = { ...req.body };
		if (req.file) {
			updates.imageUrl = `/uploads/${req.file.filename}`;
		}

		const event = await Event.findByIdAndUpdate(req.params.id, updates, {
			new: true,
			runValidators: true,
		});

		if (!event) {
			return res.status(404).json({ message: 'Event not found' });
		}
		return res.json({ event });
	} catch (err) {
		next(err);
	}
}

export async function deleteEvent(req, res, next) {
	try {
		const event = await Event.findByIdAndDelete(req.params.id);
		if (!event) {
			return res.status(404).json({ message: 'Event not found' });
		}
		return res.json({ message: 'Deleted' });
	} catch (err) {
		next(err);
	}
}

export async function registerForEvent(req, res, next) {
	try {
		const event = await Event.findById(req.params.id);
		if (!event) {
			return res.status(404).json({ message: 'Event not found' });
		}

		const userId = req.user._id.toString();
		const alreadyRegistered = event.attendees.some(
			(id) => id.toString() === userId
		);

		if (!alreadyRegistered) {
			event.attendees.push(req.user._id);
			await event.save();
		}

		return res.json({ event });
	} catch (err) {
		next(err);
	}
}

export async function unregisterFromEvent(req, res, next) {
	try {
		const event = await Event.findById(req.params.id);
		if (!event) {
			return res.status(404).json({ message: 'Event not found' });
		}

		const userId = req.user._id.toString();
		event.attendees = event.attendees.filter(
			(id) => id.toString() !== userId
		);
		await event.save();

		return res.json({ event });
	} catch (err) {
		next(err);
	}
}
