// src/controllers/job-application.controller.js
import { JobApplication } from '../models/JobApplication.js';
import { Job } from '../models/Job.js';

export async function createApplication(req, res, next) {
	try {
		const { jobId } = req.params;
		const { coverLetter, resumeUrl } = req.body;

		const job = await Job.findById(jobId);
		if (!job) {
			return res.status(404).json({ message: 'Job not found' });
		}

		const existingApplication = await JobApplication.findOne({
			job: jobId,
			applicant: req.user._id,
		});

		if (existingApplication) {
			return res
				.status(400)
				.json({ message: 'You have already applied for this job' });
		}

		const application = await JobApplication.create({
			job: jobId,
			applicant: req.user._id,
			coverLetter,
			resumeUrl,
		});

		await application.populate('job', 'title company location');
		await application.populate('applicant', 'firstName lastName email');

		return res.status(201).json({ application });
	} catch (err) {
		next(err);
	}
}

export async function getApplication(req, res, next) {
	try {
		const { id } = req.params;
		const application = await JobApplication.findById(id)
			.populate('job', 'title company location description qualifications')
			.populate('applicant', 'firstName lastName email');

		if (!application) {
			return res.status(404).json({ message: 'Application not found' });
		}

		if (
			application.applicant._id.toString() !== req.user._id.toString() &&
			!req.user.roles?.includes('admin')
		) {
			return res.status(403).json({ message: 'Access denied' });
		}

		return res.json({ application });
	} catch (err) {
		next(err);
	}
}

export async function getUserApplications(req, res, next) {
	try {
		const applications = await JobApplication.find({
			applicant: req.user._id,
		})
			.populate('job', 'title company location')
			.sort({ appliedAt: -1 });

		return res.json({ applications });
	} catch (err) {
		next(err);
	}
}

export async function getJobApplications(req, res, next) {
	try {
		const { jobId } = req.params;

		const job = await Job.findById(jobId);
		if (!job) {
			return res.status(404).json({ message: 'Job not found' });
		}

		if (
			job.postedBy.toString() !== req.user._id.toString() &&
			!req.user.roles?.includes('admin')
		) {
			return res.status(403).json({ message: 'Access denied' });
		}

		const applications = await JobApplication.find({ job: jobId })
			.populate('applicant', 'firstName lastName email headline company')
			.sort({ appliedAt: -1 });

		return res.json({ applications });
	} catch (err) {
		next(err);
	}
}

export async function updateApplicationStatus(req, res, next) {
	try {
		const { id } = req.params;
		const { status, notes } = req.body;

		const application = await JobApplication.findById(id).populate('job');
		if (!application) {
			return res.status(404).json({ message: 'Application not found' });
		}

		if (
			application.job.postedBy.toString() !== req.user._id.toString() &&
			!req.user.roles?.includes('admin')
		) {
			return res.status(403).json({ message: 'Access denied' });
		}

		if (status) application.status = status;
		if (notes !== undefined) application.notes = notes;

		await application.save();
		await application.populate('applicant', 'firstName lastName email');

		return res.json({ application });
	} catch (err) {
		next(err);
	}
}
