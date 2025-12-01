import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema(
	{
		job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
		applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		coverLetter: { type: String },
		resumeUrl: { type: String },
		status: { 
			type: String, 
			enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'], 
			default: 'pending',
			index: true
		},
		notes: { type: String },
		appliedAt: { type: Date, default: Date.now, index: true },
	},
	{ timestamps: true }
);

// Ensure one application per user per job
JobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

