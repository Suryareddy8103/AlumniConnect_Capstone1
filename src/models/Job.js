import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String },
		qualifications: { type: String },
		location: { type: String },
		company: { type: String },
		applicationUrl: { type: String },
		postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		postedAt: { type: Date, default: Date.now, index: true },
	},
	{ timestamps: true }
);

JobSchema.index({ title: 'text', company: 'text', location: 'text', description: 'text' });

export const Job = mongoose.model('Job', JobSchema);
