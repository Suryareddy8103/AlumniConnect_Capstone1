import dotenv from 'dotenv';
import { connectToDatabase, disconnectFromDatabase } from '../config/db.js';
import { User } from '../models/User.js';

dotenv.config();

async function createAdmin() {
	try {
		await connectToDatabase();
		console.log('✅ Connected to database');

		// Check if admin already exists
		const existingAdmin = await User.findOne({ email: 'kusha@admin.com' });
		
		if (existingAdmin) {
			// Update existing admin
			existingAdmin.password = '123';
			existingAdmin.roles = ['admin', 'user'];
			existingAdmin.firstName = 'Kusha';
			existingAdmin.lastName = 'Admin';
			await existingAdmin.save();
			console.log('✅ Updated existing admin user: kusha@admin.com');
		} else {
			// Create new admin
			const admin = await User.create({
				firstName: 'Kusha',
				lastName: 'Admin',
				email: 'kusha@admin.com',
				password: '123',
				roles: ['admin', 'user'],
			});
			console.log('✅ Created new admin user: kusha@admin.com');
		}

		console.log('\n📝 Admin credentials:');
		console.log('   Email: kusha@admin.com');
		console.log('   Password: 123');
		console.log('   Roles: admin, user\n');

		await disconnectFromDatabase();
		process.exit(0);
	} catch (error) {
		console.error('❌ Error creating admin:', error);
		process.exit(1);
	}
}

createAdmin();

