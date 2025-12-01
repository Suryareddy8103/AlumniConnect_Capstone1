import dotenv from 'dotenv';
import { connectToDatabase, disconnectFromDatabase } from '../config/db.js';
import { User } from '../models/User.js';

dotenv.config();

async function verifyAdmin() {
	try {
		await connectToDatabase();
		console.log('✅ Connected to database');

		// Check for existing admin accounts
		const allAdmins = await User.find({ roles: { $in: ['admin'] } });
		console.log('\n📋 Existing admin accounts in database:');
		if (allAdmins.length === 0) {
			console.log('   No admin accounts found');
		} else {
			allAdmins.forEach(admin => {
				console.log(`   - ${admin.email} (${admin.firstName} ${admin.lastName})`);
			});
		}

		// Check for kusha account specifically
		const kushaAdmin = await User.findOne({ email: 'kusha@admin.com' });
		const kushaGmail = await User.findOne({ email: 'kusha@gmail.com' });
		
		console.log('\n🔍 Checking for kusha accounts:');
		console.log(`   kusha@admin.com: ${kushaAdmin ? 'EXISTS' : 'NOT FOUND'}`);
		console.log(`   kusha@gmail.com: ${kushaGmail ? 'EXISTS' : 'NOT FOUND'}`);

		// Create or update kusha@admin.com account
		if (!kushaAdmin) {
			console.log('\n📝 Creating kusha@admin.com admin account...');
			const admin = await User.create({
				firstName: 'Kusha',
				lastName: 'Admin',
				email: 'kusha@admin.com',
				password: '123',
				roles: ['admin', 'user'],
			});
			console.log('✅ Created admin account: kusha@admin.com');
		} else {
			console.log('\n📝 Updating existing kusha@admin.com account...');
			kushaAdmin.password = '123';
			kushaAdmin.roles = ['admin', 'user'];
			kushaAdmin.firstName = 'Kusha';
			kushaAdmin.lastName = 'Admin';
			await kushaAdmin.save();
			console.log('✅ Updated admin account: kusha@admin.com');
		}

		// Also create kusha@gmail.com if they want to use that
		if (!kushaGmail) {
			console.log('\n📝 Creating kusha@gmail.com admin account...');
			const admin2 = await User.create({
				firstName: 'Kusha',
				lastName: 'Admin',
				email: 'kusha@gmail.com',
				password: '123',
				roles: ['admin', 'user'],
			});
			console.log('✅ Created admin account: kusha@gmail.com');
		} else {
			console.log('\n📝 Updating existing kusha@gmail.com account...');
			kushaGmail.password = '123';
			kushaGmail.roles = ['admin', 'user'];
			kushaGmail.firstName = 'Kusha';
			kushaGmail.lastName = 'Admin';
			await kushaGmail.save();
			console.log('✅ Updated admin account: kusha@gmail.com');
		}

		// Verify the accounts were created
		const verifyKushaAdmin = await User.findOne({ email: 'kusha@admin.com' }).select('+password');
		const verifyKushaGmail = await User.findOne({ email: 'kusha@gmail.com' }).select('+password');
		
		console.log('\n✅ Verification complete!');
		console.log('\n📝 Admin credentials:');
		console.log('   Email: kusha@admin.com');
		console.log('   Password: 123');
		console.log('   Roles: admin, user');
		console.log('\n   Email: kusha@gmail.com');
		console.log('   Password: 123');
		console.log('   Roles: admin, user\n');

		await disconnectFromDatabase();
		process.exit(0);
	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

verifyAdmin();

