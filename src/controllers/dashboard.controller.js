// src/controllers/dashboard.controller.js
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { Job } from '../models/Job.js';
import { Story } from '../models/Story.js';

export async function getStats(req, res, next) {
	try {
		const [users, events, jobs, stories] = await Promise.all([
			User.estimatedDocumentCount(),
			Event.countDocuments({ datetime: { $gte: new Date() } }),
			Job.countDocuments({}),
			Story.countDocuments({}),
		]);

		return res.json({
			users,
			upcomingEvents: events,
			jobs,
			stories,
		});
	} catch (err) {
		next(err);
	}
}

export async function getMyDashboard(req, res, next) {
	try {
		const [events, stories, jobs] = await Promise.all([
			Event.find({ attendees: req.user._id }).sort({ datetime: 1 }).limit(10),
			Story.find({ author: req.user._id }).sort({ createdAt: -1 }).limit(10),
			Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 }).limit(10),
		]);

		return res.json({
			profile: req.user,
			events,
			stories,
			jobs,
		});
	} catch (err) {
		next(err);
	}
}
