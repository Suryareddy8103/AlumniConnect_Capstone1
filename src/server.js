import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import { connectToDatabase } from './config/db.js';
import { User } from './models/User.js';
import { Event } from './models/Event.js';
import { Job } from './models/Job.js';
import { Story } from './models/Story.js'; // (imported but OK even if unused)

dotenv.config();

const port = process.env.PORT || 4000;

// Helper: mask Mongo URI in logs
function maskMongoUri(uri = '') {
  if (!uri) return '(not set)';
  // Very simple masking: keep prefix and db name, hide credentials/host details
  const parts = uri.split('@');
  if (parts.length === 2) {
    return parts[0].split('//')[0] + '//***:***@' + parts[1].split('/')[1];
  }
  return '*** MONGODB_URI ***';
}

// Seed data for development
async function seedDatabase() {
  try {
    console.log('Checking if database needs seeding...');

    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database with test data...');

    // Admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'ChangeMe123!',
      roles: ['admin', 'user'],
    });
    console.log('Admin user created:', admin.email);

    // Sample alumni
    const sampleAlumni = [
      {
        firstName: 'Jennifer',
        lastName: 'Parker',
        email: 'jennifer.parker@alumni.edu',
        password: 'password123',
        graduationYear: 2015,
        degree: 'Bachelor of Science',
        major: 'Computer Science',
        company: 'Google',
        location: 'San Francisco, CA',
        industry: 'Technology',
      },
      {
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@alumni.edu',
        password: 'password123',
        graduationYear: 2018,
        degree: 'Master of Science',
        major: 'Data Science',
        company: 'Microsoft',
        location: 'Seattle, WA',
        industry: 'Technology',
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@alumni.edu',
        password: 'password123',
        graduationYear: 2016,
        degree: 'Bachelor of Arts',
        major: 'Business Administration',
        company: 'Amazon',
        location: 'Austin, TX',
        industry: 'E-commerce',
      },
    ];

    for (const alumni of sampleAlumni) {
      await User.create({
        ...alumni,
        headline: `${alumni.firstName} ${alumni.lastName} - ${alumni.company}`,
        bio: `Alumni from Class of ${alumni.graduationYear} with a ${alumni.degree} in ${alumni.major}. Currently working as a professional in ${alumni.industry} at ${alumni.company}.`,
      });
    }
    console.log(`Created ${sampleAlumni.length} sample alumni records`);

    // Sample events
    const upcomingEvents = [
      {
        title: 'Welcome Meetup',
        description: 'Kickoff event for new alumni',
        location: 'Campus Auditorium',
        datetime: new Date(Date.now() + 7 * 86400000),
        createdBy: admin._id,
      },
      {
        title: 'Tech Talk',
        description: 'Industry trends discussion',
        location: 'Virtual Event',
        datetime: new Date(Date.now() + 14 * 86400000),
        createdBy: admin._id,
      },
    ];

    for (const event of upcomingEvents) {
      await Event.create(event);
    }
    console.log('Created sample events');

    // Sample jobs
    await Job.create([
      {
        title: 'Software Engineer',
        company: 'Acme Corp',
        location: 'Remote',
        description: 'Build amazing features for our platform',
        postedBy: admin._id,
      },
      {
        title: 'Data Analyst',
        company: 'TechCorp',
        location: 'NYC',
        description: 'Analyze data and create insights',
        postedBy: admin._id,
      },
    ]);
    console.log('Created sample jobs');

    console.log('Database seeding complete!');
    console.log('Test credentials:');
    console.log('  Admin: admin@example.com / ChangeMe123!');
    console.log('  Alumni: jennifer.parker@alumni.edu / password123');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function start() {
  console.log('Starting server...');
  console.log('Connecting to database...');

  try {
    await connectToDatabase();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }

  console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
  console.log('🔍 MONGODB_URI (masked):', maskMongoUri(process.env.MONGODB_URI));
  console.log(
    '🔍 Should seed?',
    process.env.NODE_ENV !== 'production' && process.env.MONGODB_URI === 'memory'
  );

  if (process.env.NODE_ENV !== 'production' && process.env.MONGODB_URI === 'memory') {
    try {
      await seedDatabase();
      console.log('✅ Database seeded successfully');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      process.exit(1);
    }
  } else {
    console.log('✅ Using existing database data');
  }

  console.log('Creating HTTP server...');
  const server = http.createServer(app);

  server.on('error', (error) => {
    console.error('❌ Server error:', error);
    process.exit(1);
  });

  console.log('Starting server on port', port);
  server.listen(port, () => {
    console.log(`✅ Server listening on port ${port}`);
    console.log(`🌐 Application available at: http://localhost:${port}`);
    console.log(`🔐 Login page: http://localhost:${port}/login.html`);
    if (process.env.NODE_ENV !== 'production') {
      console.log('📚 Swagger docs at /api/docs');
    }
  });
}

start().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});

process.on('exit', (code) => {
  console.log('Process exiting with code:', code);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
