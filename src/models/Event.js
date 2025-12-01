import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String },
		location: { type: String },
		datetime: { type: Date, required: true, index: true },
		imageUrl: { type: String },
		attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	},
	{ timestamps: true }
);

export const Event = mongoose.model('Event', EventSchema);
