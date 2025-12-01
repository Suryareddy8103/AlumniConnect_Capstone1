import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema(
	{
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		title: { type: String, required: true, trim: true },
		content: { type: String, required: true },
		tags: [{ type: String }],
		year: { type: Number },
		company: { type: String },
		categories: [{ type: String }],
		submittedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

StorySchema.index({ title: 'text', content: 'text', company: 'text' });
StorySchema.index({ tags: 1, categories: 1 });

export const Story = mongoose.model('Story', StorySchema);
