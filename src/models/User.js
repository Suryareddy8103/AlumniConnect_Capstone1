import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true, trim: true },
		lastName: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true, select: false },
		graduationYear: { type: Number },
		degree: { type: String },
		major: { type: String },
		location: { type: String },
		industry: { type: String },
		company: { type: String },
		headline: { type: String },
		bio: { type: String },
		avatarUrl: { type: String },
		roles: { type: [String], default: ['user'], index: true },
		connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

UserSchema.index({ firstName: 'text', lastName: 'text', company: 'text', industry: 'text', major: 'text' });

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.methods.comparePassword = async function (candidate) {
	return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', UserSchema);
