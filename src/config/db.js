import mongoose from 'mongoose';

let memoryServer; // lazy

export async function connectToDatabase() {
	let mongoUri = process.env.MONGODB_URI;
	console.log('🔍 MONGODB_URI from environment:', mongoUri);
	console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
	
	if (!mongoUri && process.env.NODE_ENV !== 'production') {
		// Use local MongoDB instead of in-memory
		mongoUri = 'mongodb://localhost:27017/alumni_network';
		console.log('🔍 Using default local MongoDB URI:', mongoUri);
	}

	mongoose.set('strictQuery', true);

	if (mongoUri === 'memory') {
		try {
			const { MongoMemoryServer } = await import('mongodb-memory-server');
			memoryServer = await MongoMemoryServer.create();
			mongoUri = memoryServer.getUri();
			console.log('Using in-memory MongoDB instance');
		} catch (error) {
			console.error('Failed to create in-memory MongoDB:', error);
			throw error;
		}
	} else {
		console.log('Using local MongoDB instance');
	}

	try {
		await mongoose.connect(mongoUri, {
			serverSelectionTimeoutMS: 5000,
			connectTimeoutMS: 10000,
		});
		console.log('Connected to MongoDB');
		
		// Test the connection
		await mongoose.connection.db.admin().ping();
		console.log('Database ping successful');
	} catch (error) {
		console.error('MongoDB connection failed:', error);
		throw error;
	}
}

export async function disconnectFromDatabase() {
	await mongoose.disconnect();
	if (memoryServer) await memoryServer.stop();
}
